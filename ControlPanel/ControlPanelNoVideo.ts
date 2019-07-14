import { createGamepadSocket } from '../Gamepad';
import { createCar } from '../Car';
import { createExpressServerWrapper } from '../Server';
import { IControlPanelNoVideoOptions } from './IControlPanelNoVideoOptions';

export class ControlPanelNoVideo
{
	private options: IControlPanelNoVideoOptions;

	constructor (options: IControlPanelNoVideoOptions)
	{
		this.options = options;
	}

	public startComponents () {

		const car = createCar();
		const webServer = createExpressServerWrapper();
		const gamepadSocket = createGamepadSocket();

		car.on('car:ready', () => {
			gamepadSocket.listen(
				this.options.gamepadSocketAddress,
				this.options.gamepadSocketPort,
				car
			);
		});

		car.start();

		webServer.serve({
			gamepadSocketAddress: this.options.gamepadSocketAddress,
			gamepadSocketPort: this.options.gamepadSocketPort
		});
	}
}
