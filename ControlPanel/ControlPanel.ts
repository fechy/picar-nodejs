import { CarFactory } from '../Car';
import { Factory } from '../Factory';
import { WebcamSocket, WebcamFactory } from '../Webcam';
import { GStreamServer, ServerFactory, WebServer } from '../Server';
import { IControlPanelOptions } from './IControlPanelOptions';
import { GamepadSocket } from '../Gamepad';

export class ControlPanel
{
	private options: IControlPanelOptions;

	private factory: Factory;
	private carFactory: CarFactory;
	private webcamFactory: WebcamFactory;
	private serverFactory: ServerFactory;

	private webServer: WebServer;
	private gStreamServer: GStreamServer;

	private gamepadSocket: GamepadSocket;
	private webcamSocket: WebcamSocket;

	public constructor (
		factory: Factory,
		options: IControlPanelOptions
	) {
		this.options = options;

		this.factory = factory;
		this.carFactory = this.factory.createCarFactory();
		this.webcamFactory = this.factory.createWebcamFactory();
		this.serverFactory = this.factory.createServerFactory();

		this.webServer = this.serverFactory.createWebServer();
		this.gStreamServer = this.serverFactory.getGStreamServer(this.options.gStreamServerOptions);

		this.webcamSocket = this.webcamFactory.getWebCamSocket();
		this.gamepadSocket = this.factory.createGamepadSocket();
	}

	public startComponents ()
	{
		const gStreamCamProcess = this.gStreamServer.start(
			this.options.gStreamTcpAddress,
			this.options.gStreamTcpPort
		);
		const server = this.webServer.serve(
			this.options.uiAddress,
			this.options.uiPort,
			this.options.broadcastAddress,
			this.options.broadcastPort
		);
		const car = this.carFactory.createCar();

		gStreamCamProcess.stdout.on('data', (data) => {

			if (data.toString().includes('Setting pipeline to PLAYING') > 0) {

				this.webcamSocket.wrap(
					this.options.gStreamTcpAddress,
					this.options.gStreamTcpPort,
					this.options.broadcastAddress,
					this.options.broadcastPort
				);
			}
		});

		gStreamCamProcess.stderr.on('data', (data) => {
			console.log(data.toString());
			this.webServer.close();
		});

		gStreamCamProcess.on('error', (err) => {
			console.log('Webcam server error: ' + err);
			this.webServer.close();
		});

		gStreamCamProcess.on('exit', (code) => {
			console.log('Webcam server exited: ' + code);
			this.webServer.close();
		});

		car.on('car:ready', () => this.gamepadSocket.listen(server, car));

		car.on('car:stop', () => {
			gStreamCamProcess.kill();
			this.webServer.close()
		});

		car.start();
	}
}
