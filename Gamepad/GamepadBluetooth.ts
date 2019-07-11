import * as gamepad from 'gamepad';
import { Car } from '../Car';

export class GamepadBluetooth
{
	// private car: Car;

	public constructor(car?: Car)
	{
		// this.car = car;

		gamepad.init();
		// Create a game loop and poll for events
		setInterval(gamepad.processEvents, 16);
		// Scan for new gamepads as a slower rate
		setInterval(gamepad.detectDevices, 500);

		gamepad.on('move', (id, axis, value) => this.mapMoving(id, axis, value));
		gamepad.on('down', (id, buttonNumber) => this.mapButtons(buttonNumber));
		gamepad.on('up', (id, buttonNumber) => this.mapButtons(buttonNumber));
	}

	private mapMoving (id: number, axis: number, value: number): void
	{
		console.log(id);
		if (axis === 0) {
			if (value === -1) {
				console.log('turn left');
				// this.car.turnLeft();
			} else if (value === 1) {
				console.log('turn right');
				// this.car.turnRight();
			}
		} else if (axis === 1) {
			if (value === -1) {
				console.log('go forward');
				// this.car.goForward();
			} else if (value === 1) {
				console.log('go reverse');
				// this.car.goReverse();
			}
		}
	}

	private mapButtons (buttonNumber: number): void
	{
		console.log(buttonNumber);
		switch (buttonNumber) {
			case 0:
				console.log('pan right');
				break;
			case 1:
				console.log('tilt down');
				break;
			case 3:
				console.log('tilt up');
				break;
			case 4:
				console.log('pan left');
				break;
			case 6:
				console.log('decelerate');
				break;
			case 7:
				console.log('accelerate');
				break;
			case 10:
				console.log('select');
				break;
			case 11:
				console.log('start');
				break;
		}
	}
}

new GamepadBluetooth();
