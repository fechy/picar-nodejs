import { Board, Motors, Servo } from "johnny-five";
import { Factory } from "./Factory";
import { PubSub, Subscription } from "../../PuSub";
import { applyMixins } from "../../helpers";

export class Car implements PubSub
{
	private board: Board;
	private motors: Motors;
	private frontWheelServo: Servo;
	private speed: number = 0;
	private factory: Factory;

	public constructor (factory: Factory)
	{
		this.factory = factory;
		this.board = this.factory.createRaspiBoard();
		this.frontWheelServo = this.factory.createFrontWheelsServo();
	}

	public start ()
	{
		this.board.on("ready", () => {
			console.log('Board Ready');

			this.motors = this.factory.createMotors();

			this.publish('car:ready');

			this.board.on('exit', () => {
				this.motors.stop();
				this.publish('car:stop');
			});

			this.board.repl.inject({
				sweep: () => {
					this.frontWheelServo.sweep();
				},
				move: (pos: number) => {
					this.frontWheelServo.to(pos);
				},
				stop: () => {
					this.frontWheelServo.stop();
				}
			});
		});
	}

	public goForward ()
	{
		this.motors.forward(this.speed);
	}

	public goReverse ()
	{
		this.motors.reverse(this.speed);
	}

	public speedUp ()
	{
		if (this.speed <= 220) {
			this.speed += 20;
		}
	}

	public speedDown ()
	{
		if (this.speed >= 20) {
			this.speed -= 20;
		}
	}

	public stop ()
	{
		this.motors.stop();
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
