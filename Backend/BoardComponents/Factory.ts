import { Board, Motors, Proximity, Servo } from 'johnny-five';
import * as Raspi from 'raspi-io';
import { Car } from "./Car";

export class Factory
{
	public createCar (): Car
	{
		return new Car(this);
	}
	public createRaspiBoard ()
	{
		return new Board({
			io: new Raspi()
		});
	}

	public createFrontWheelsServo ()
	{
		return new Servo({
			pin: 0,
			controller: 'PCA9685',
			range: [ 50, 75 ],
			startAt: 62.5
		});
	}

	public createPanServo ()
	{
		return new Servo({
			pin: 1,
			controller: 'PCA9685',
			range: [ 35, 70 ],
			startAt: 52.5
		});
	}

	public createTiltServo ()
	{
		return new Servo({
			pin: 2,
			controller: 'PCA9685',
			range: [ 42, 75 ],
			startAt: 58.5
		});
	}

	public createMotors ()
	{
		return new Motors([
			{ controller: "PCA9685", pins: { pwm: 4, dir: 6 }},
			{ controller: "PCA9685", pins: { pwm: 5, dir: 7 }}
		]);
	}

	public createProximitySenser ()
	{
		return new Proximity({
			controller: "HCSR04",
			pin: 28 // Change PIN for correct one
		});
	}
}
