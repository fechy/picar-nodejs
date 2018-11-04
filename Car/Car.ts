import { Board, Motors, Servo } from 'johnny-five';
import { EventEmitter } from 'events';

import { createRaspiBoard, createMotors, createFrontWheelsServo, createPanServo, createTiltServo } from './CarFactory';
import { CustomServo } from "./CustomServo";

export class Car extends EventEmitter
{
	private board: Board;
	private motors: Motors | undefined;
	private frontWheelServo: Servo | undefined;
	private panServo: CustomServo | undefined;
	private tiltServo: CustomServo | undefined;
	private speed: number = 40;

	public constructor ()
	{
		super();

		this.board = createRaspiBoard();
	}

	public start ()
	{
		this.board.on('ready', () => {
			console.log('board:ready');

			this.startComponents();
			this.startRepl();

			this.emit('car:ready');
			console.log('car:ready');
		});

		this.board.on('exit', () => {
			this.stop();
			this.turnForward();
			this.emit('car:stop');
			console.log('car:stop');
		});
	}

	private startComponents (): void
	{
		this.motors = createMotors();
		this.frontWheelServo = createFrontWheelsServo();
		this.panServo = createPanServo();
		this.tiltServo = createTiltServo();

	}

	private startRepl (): void
	{
		this.board.repl.inject({
			motors: this.motors,
			frontServo: this.frontWheelServo,
			pan: this.panServo,
			tilt: this.tiltServo
		});
	}

	public goForward ()
	{
		if (this.motors){
			this.motors.reverse(this.speed);
		}
	}

	public goReverse ()
	{
		if (this.motors) {
			this.motors.forward(this.speed);
		}
	}

	public stop ()
	{
		if (this.motors) {
			this.motors.stop();
		}
	}

	public speedUp ()
	{
		if (this.speed < 240) {
			this.speed += 1;
		}
	}

	public speedDown ()
	{
		if (this.speed > 40) {
			this.speed -= 1;
		}
	}

	public turnLeft ()
	{
		if (this.frontWheelServo) {
			this.frontWheelServo.min();
		}
	}

	public turnRight ()
	{
		if (this.frontWheelServo) {
			this.frontWheelServo.max();
		}
	}

	public turnForward ()
	{
		if (this.frontWheelServo) {
			this.frontWheelServo.center();
		}
	}

	public panLeft ()
	{
		if (this.panServo) {
			if (this.panServo.position < this.panServo.range[1]) {
				this.panServo.to(this.panServo.position + 1);
			}
		}
	}

	public panRight ()
	{
		if (this.panServo) {
			if (this.panServo.position > this.panServo.range[0]) {
				this.panServo.to(this.panServo.position - 1);
			}
		}
	}

	public panTo (position: number)
	{
		if (this.panServo && this.isPanSynchronized()) {
			if (this.panServo.position < this.panServo.range[1] && this.panServo.position > this.panServo.range[0]) {
				this.panServo.moveTo(position);
			}
		}
	}

	public tiltTo (position: number)
	{
		if (this.tiltServo && this.isTiltSynchronized()) {
			if (this.tiltServo.position < this.tiltServo.range[1] && this.tiltServo.position > this.tiltServo.range[0]) {
				this.tiltServo.moveTo(position);
			}
		}
	}

	public tiltDown ()
	{
		if (this.tiltServo) {
			if (this.tiltServo.position > this.tiltServo.range[0]) {
				this.tiltServo.to(this.tiltServo.position - 1);
			}
		}
	}

	public tiltUp ()
	{
		if (this.tiltServo) {
			if (this.tiltServo.position < this.tiltServo.range[1]) {
				this.tiltServo.to(this.tiltServo.position + 1);
			}
		}
	}

	public centerPanTil ()
	{
		if (this.tiltServo && this.panServo) {
			this.tiltServo.center();
			this.panServo.center();
		}
	}

	public isPanSynchronized (): boolean
	{
		return this.panServo ? this.panServo.isSynchronized : false;
	}

	public synchronizePan (startAt: number): void
	{
		if (this.panServo) {
			this.panServo.synchronizeWithExternalDevice(startAt);
		}
	}

	public isTiltSynchronized (): boolean
	{
		return this.tiltServo ? this.tiltServo.isSynchronized : false;
	}

	public synchronizeTilt (startAt: number): void
	{
		if (this.tiltServo) {
			this.tiltServo.synchronizeWithExternalDevice(startAt);
		}
	}
}
