import { IControlPanelOptions } from './IControlPanelOptions';
import { CarFactory } from '../Car';
import { Factory } from '../Factory';
import { WebcamSocket, createWebCamSocket } from '../Webcam';
import { GamepadSocket } from '../Gamepad';
import {
	GStreamServer,
	Http2ServerWrapper,
	IGStreamServerOptions,
	createGStreamServer,
	createHttp2ServerWrapper
} from '../Server';
import { createGamepadSocket } from "../Gamepad/GamepadFactory";

export class ControlPanel
{
	private options: IControlPanelOptions;

	private factory: Factory;
	private carFactory: CarFactory;

	private webServer: Http2ServerWrapper;
	private gStreamServer: GStreamServer;

	private gamepadSocket: GamepadSocket;
	private webcamSocket: WebcamSocket;

	public constructor (
		factory: Factory,
		options: IControlPanelOptions,
		gstreamOptions: IGStreamServerOptions
	) {
		this.options = options;

		this.factory = factory;
		this.carFactory = this.factory.createCarFactory();

		this.webServer = createHttp2ServerWrapper();
		this.gStreamServer = createGStreamServer(gstreamOptions);

		this.webcamSocket = createWebCamSocket();
		this.gamepadSocket = createGamepadSocket();
	}

	public startComponents ()
	{
		const car = this.carFactory.createCar();
		const gStreamCamProcess = this.gStreamServer.start(
			this.options.gStreamTcpAddress,
			this.options.gStreamTcpPort
		);

		this.webServer.serve({
			gamepadSocketAddress: this.options.gamepadSocketAddress,
			gamepadSocketPort: this.options.gamepadSocketPort,
			webcamSocketAddress: this.options.webcamSocketAddress,
			webcamSocketPort: this.options.webcamSocketPort,
		});

		gStreamCamProcess.stdout.on('data', (data) => {

			if (data.toString().includes('Setting pipeline to PLAYING') > 0) {

				this.webcamSocket.wrapGStreamBroadcast(
					this.options.gStreamTcpAddress,
					this.options.gStreamTcpPort,
					this.options.webcamSocketAddress,
					this.options.webcamSocketPort
				);
			}
		});

		/*gStreamCamProcess.stderr.on('data', (data) => {
			console.log(`Webcam server error: ${data}`);
		});

		gStreamCamProcess.on('error', (err) => {
			console.log(`Webcam server error: ${err}`);
		});

		gStreamCamProcess.on('exit', (code) => {
			console.log(`Webcam server exited: ${code}`);
		});*/

		car.on('car:ready', () => {
			this.gamepadSocket.listen(
				this.options.gamepadSocketAddress,
				this.options.gamepadSocketPort,
				car
			);
		});

		car.on('car:stop', () => gStreamCamProcess.kill());

		car.start();
	}
}
