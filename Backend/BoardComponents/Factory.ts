import { Board, Motors, Proximity, Servo } from "johnny-five";
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
			controller: 'PCA9685'
		});
	}

	public createPanServo ()
	{
		return new Servo({
			pin: 1,
			controller: 'PCA9685'
		});
	}

	public createTiltServo ()
	{
		return new Servo({
			pin: 2,
			controller: 'PCA9685'
		});
	}

	public createMotors ()
	{
		return new Motors([
			{ pins: { pwm: 26, dir: 0 } },
			{ pins: { pwm: 23, dir: 2 } }
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
