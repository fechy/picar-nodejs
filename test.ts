import { CarFactory } from './Car';
import { WebServer } from './Server';
import { Factory } from './Factory';
import { GamepadSocket } from './Gamepad';

interface ITestControlPanelOptions
{
	uiAddress: string,
	uiPort: 11000,
	broadcastAddress: string,
	broadcastPort: 12000,
}

class Test {

	private factory: Factory;
	private carFactory: CarFactory;
	private webServer: WebServer;
	private options: ITestControlPanelOptions;
	private gamepadSocket: GamepadSocket;

	constructor (
		factory: Factory,
		options: ITestControlPanelOptions
	) {
		this.factory = factory;
		this.options = options;
		this.carFactory = factory.createCarFactory();
		this.webServer = this.factory.createServerFactory().createWebServer();
		this.gamepadSocket = this.factory.createGamepadSocket();
	}

	public start () {

		const server = this.webServer.serve(
			this.options.uiAddress,
			this.options.uiPort,
			this.options.broadcastAddress,
			this.options.broadcastPort
		);
		const car = this.carFactory.createCar();

		car.on('car:ready', () => this.gamepadSocket.listen(server, car));

		car.on('car:stop', () => this.webServer.close());

		car.start();
	}
}

const controlPanelOptions: ITestControlPanelOptions = {
	uiAddress: '192.168.0.17',
	uiPort: 11000,
	broadcastAddress: '192.168.0.17',
	broadcastPort: 12000,
};

const factory = new Factory();
const test = new Test(
	factory,
	controlPanelOptions);

test.start();
