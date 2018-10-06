import { Board, Motors, Servo } from "johnny-five";
import { Factory } from "./Factory";
import { PubSub, Subscription } from "../../PuSub";
import { applyMixins } from "../../helpers";

export class Car implements PubSub
{
	private factory: Factory;
	private board: Board;
	private motors: Motors | undefined;
	private frontWheelServo: Servo | undefined;
	private panServo: Servo | undefined;
	private tiltServo: Servo | undefined;
	private speed: number = 40;

	public constructor (factory: Factory)
	{
		this.factory = factory;
		this.board = this.factory.createRaspiBoard();
	}

	public start ()
	{
		this.board.on("ready", () => {
			console.log('Board Ready');

			this.motors = this.factory.createMotors();
			this.frontWheelServo = this.factory.createFrontWheelsServo();
			this.panServo = this.factory.createPanServo();
			this.tiltServo = this.factory.createTiltServo();

			this.publish('car:ready');

			this.board.on('exit', () => {
				this.stop();
				this.publish('car:stop');
			});

			this.board.repl.inject({
				motors: this.motors,
				frontServo: this.frontWheelServo,
				pan: this.panServo,
				tilt: this.tiltServo
			});
		});
	}

	public goForward ()
	{
		this.motors.reverse(this.speed);
		console.log(`go reverse at ${this.speed}`);
	}

	public goReverse ()
	{
		this.motors.forward(this.speed);
		console.log(`go forward at ${this.speed}`);
	}

	public stop ()
	{
		this.motors.stop();
		// console.log(`stop at ${this.speed}`);
	}

	public speedUp ()
	{
		if (this.speed < 240) {
			this.speed += 1;
		}
		console.log(`speed up to ${this.speed}`);
	}

	public speedDown ()
	{
		if (this.speed > 40) {
			this.speed -= 1;
		}
		console.log(`speed down to ${this.speed}`);
	}

	public turnLeft ()
	{
		this.frontWheelServo.min();
		console.log('turn left');
	}

	public turnRight ()
	{
		this.frontWheelServo.max();
		console.log('turn right');
	}

	public turnForward ()
	{
		this.frontWheelServo.center();
		// console.log('turn forward');
	}

	public panLeft ()
	{
		if (this.panServo.position < this.panServo.range[1]) {
			this.panServo.to(this.panServo.position + 5);
			console.log('pan left');
		} else {
			console.log('max pan left reached');
		}
	}

	public panRight ()
	{
		if (this.panServo.position > this.panServo.range[0]) {
			this.panServo.to(this.panServo.position - 5);
			console.log('pan right');
		} else {
			console.log('max pan right reached');
		}
	}

	public tiltDown ()
	{
		if (this.tiltServo.position > this.tiltServo.range[0]) {
			this.tiltServo.to(this.tiltServo.position - 5);
			console.log('tilt down');
		} else {
			console.log('max tilt down reached');
		}
	}

	public tiltUp ()
	{
		if (this.tiltServo.position < this.tiltServo.range[1]) {
			this.tiltServo.to(this.tiltServo.position + 5);
			console.log('tilt up');
		} else {
			console.log('max tilt up reached');
		}
	}

	public getUId(): string {}

	public publish(eventName: string, ...args: any[]): void {}

	public subscribe(subscribeRequest: Subscription): void {}

	public unSubscribe(subscriber: PubSub, eventName: string): void {}

	public unSubscribeAll(subscriber: PubSub): void {}

	public subscriptions: Subscription[] = [];
	public readonly uuid: string = '';
}

applyMixins(Car, [PubSub]);
