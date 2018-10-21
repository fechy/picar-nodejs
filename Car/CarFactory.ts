import { Board, Motors, Servo } from 'johnny-five';

import { Car } from './Car';

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
		range: [ 50, 75 ],
		startAt: 62.5
	});
}

export function createPanServo (): Servo
{
	return new Servo({
		pin: 1,
		controller: 'PCA9685',
		range: [ 35, 70 ],
		startAt: 52.5
	});
}

export function createTiltServo (): Servo
{
	return new Servo({
		pin: 2,
		controller: 'PCA9685',
		range: [ 42, 75 ],
		startAt: 58.5
	});
}

export function createMotors (): Motors
{
	return new Motors([
		{ controller: 'PCA9685', pins: { pwm: 4, dir: 6 }},
		{ controller: 'PCA9685', pins: { pwm: 5, dir: 7 }}
	]);
}
