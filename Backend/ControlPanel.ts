import { Factory } from "./Factory";
import { Factory as BoardComponentsFactory } from "./BoardComponents/Factory";
import { Factory as WebcamFactory } from "./Webcam/Factory";
import { ControlPanelOptions } from "./ControlPanelOptions";
import { WebServer } from "./WebServer";
import { SocketWebCamWrapper } from "./Webcam/SocketWebCamWrapper";
import { GStreamServer } from "./Webcam/GStreamServer";
import { GamepadSocket } from "./GamepadSocket";
import { PubSub, Subscription } from "../PuSub";
import { applyMixins } from "../helpers";

export class ControlPanel implements PubSub
{
	private factory: Factory;
	private boardComponentsFactory: BoardComponentsFactory;
	private webcamFactory: WebcamFactory;
	private options: ControlPanelOptions;
	private webServer: WebServer;
	private socketCamWrapper: SocketWebCamWrapper;
	private gStreamServer: GStreamServer;
	private gamepadSocket: GamepadSocket;

	public constructor (
		factory: Factory,
		boardComponentsFactory: BoardComponentsFactory,
		webcamFactory: WebcamFactory,
		options: ControlPanelOptions
	) {
		this.factory = factory;
		this.boardComponentsFactory = boardComponentsFactory;
		this.webcamFactory = webcamFactory;
		this.options = options;

		this.webServer = this.factory.getWebServer();
		this.gamepadSocket = this.factory.getGamepadSocket();
		this.socketCamWrapper = this.webcamFactory.getSocketWebCamWrapper();
		this.gStreamServer = this.webcamFactory.getGStreamServer(this.options.gStreamServerOptions);
	}

	public startComponents ()
	{
		const gStreamCamProcess = this.gStreamServer.start(
			this.options.gStreamTcpAddress,
			this.options.gStreamTcpPort
		);

		gStreamCamProcess.stdout.on('data', (data) => {
			console.log(data.toString());
			// This catches GStreamer when pipeline goes into PLAYING state
			if (data.toString().includes('Setting pipeline to PLAYING') > 0) {

				this.socketCamWrapper.wrap(
					this.options.gStreamTcpAddress,
					this.options.gStreamTcpPort,
					this.options.broadcastAddress,
					this.options.broadcastPort
				);

				const car = this.boardComponentsFactory.createCar();

				car.subscribe({
					event: 'car:ready',
					subscriber: this,
					callback: () => {
						console.log('car:ready');

						this.webServer.serve(
							this.options.uiAddress,
							this.options.uiPort,
							this.options.broadcastAddress,
							this.options.broadcastPort
						);

						console.log(this.webServer.getServer());
						this.gamepadSocket.listen(this.webServer.getServer(), car);

						car.subscribe({
							event: 'car:stop',
							subscriber: this,
							callback: () => {
								this.webServer.close();
							}
						});

					}
				});

				car.start();

				this.gamepadSocket.listen(this.webServer.getServer(), car);

				if (this.options.start) this.options.start();

			}
		});

		gStreamCamProcess.stderr.on('data', (data) => {
			console.log(data.toString());
			this.webServer.close();
		});

		gStreamCamProcess.on('error', (err) => {
			console.log("Webcam server error: " + err);
			this.webServer.close();
		});

		gStreamCamProcess.on('exit', (code) => {
			console.log("Webcam server exited: " + code);
			this.webServer.close();
		});
	}

	public getUId(): string {}

	public publish(eventName: string, ...args: any[]): void {}

	public subscribe(subscribeRequest: Subscription): void {}

	public unSubscribe(subscriber: PubSub, eventName: string): void {}

	public unSubscribeAll(subscriber: PubSub): void {}

	public subscriptions: Subscription[] = [];
	public readonly uuid: string = '';
}

applyMixins(ControlPanel, [PubSub]);
