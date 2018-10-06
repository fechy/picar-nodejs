import { Factory as BoardComponentsFactory } from "./Backend/BoardComponents/Factory";
import { PubSub, Subscription } from "./PuSub";
import { applyMixins } from "./helpers";
import { WebServer } from "./Backend/WebServer";
import { Factory } from "./Backend/Factory";
import { ControlPanelOptions } from "./Backend/ControlPanelOptions";
import { GamepadSocket } from "./Backend/GamepadSocket";

class Test implements PubSub{

	private boardComponentsFactory: BoardComponentsFactory;
	private factory: Factory;
	private webServer: WebServer;
	private options: ControlPanelOptions;
	private gamepadSocket: GamepadSocket;

	constructor (
		factory: Factory,
		boardComponentsFactory: BoardComponentsFactory,
		options: ControlPanelOptions
	) {
		this.factory = factory;
		this.options = options;
		this.boardComponentsFactory = boardComponentsFactory;
		this.webServer = this.factory.getWebServer();
		this.gamepadSocket = this.factory.getGamepadSocket();
	}

	public start () {

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

	public getUId(): string {}

	public publish(eventName: string, ...args: any[]): void {}

	public subscribe(subscribeRequest: Subscription): void {}

	public unSubscribe(subscriber: PubSub, eventName: string): void {}

	public unSubscribeAll(subscriber: PubSub): void {}

	public subscriptions: Subscription[] = [];
	public readonly uuid: string = '';
}

applyMixins(Test, [PubSub]);

const controlPanelOptions: ControlPanelOptions = {
	gStreamTcpAddress: "192.168.0.17",
	gStreamTcpPort: 10000,
	uiAddress: "192.168.0.17",
	uiPort: 11000,
	broadcastAddress: "192.168.0.17",
	broadcastPort: 12000,
	start: () => {},
};
const factory = new Factory();
const boardComponentsFactory = new BoardComponentsFactory();
const test = new Test(
	factory,
	boardComponentsFactory,
	controlPanelOptions);

test.start();
