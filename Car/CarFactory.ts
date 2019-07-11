import { Board, Motor, Servo } from 'johnny-five';

import { Car } from './Car';
import { CustomServo } from "./CustomServo";

const RaspiIO = require('raspi-io');

export function createCar (): Car
{
	return new Car();
}

export function createRaspiBoard (): Board
{
	return new Board({
		io: new RaspiIO()
	});
}

export function createFrontWheelsServo (): Servo
{
	return new Servo({
		pin: 0,
		controller: 'PCA9685',
		range: [ 50, 78 ],
		startAt: 64
	});
}

export function createPanServo (): CustomServo
{
	return new CustomServo({
		pin: 1,
		controller: 'PCA9685',
		range: [ 30, 75 ],
		startAt: 52.5
	});
}

export function createTiltServo (): CustomServo
{
	return new CustomServo({
		pin: 2,
		controller: 'PCA9685',
		range: [ 0, 80 ],
		startAt: 45 //60
	});
}

export function createMotors (): Array<Motor>
{
	return [
		new Motor({ controller: 'PCA9685', pins: { pwm: 4, dir: 7 }}),
		new Motor({ controller: 'PCA9685', pins: { pwm: 5, dir: 6 }})
	];
}
