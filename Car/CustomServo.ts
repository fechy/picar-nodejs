import { Servo, ServoGeneralOption } from "johnny-five";

export class CustomServo extends Servo
{
	private synchronized: boolean = false;
	private externalDeviceStartAt: number = 0;

	public constructor (options: ServoGeneralOption)
	{
		super(options);
	}

	public synchronizeWithExternalDevice (startAt: number)
	{
		this.externalDeviceStartAt = startAt;
		this.synchronized = true;
	}

	public moveTo (position: number)
	{
		position = this.mapPosition(position);

		if (position === this.position) {
			return;
		}

		if (position < this.range[1] && position > this.range[0] &&
			this.position < this.range[1] && this.position > this.range[0]) {
			this.to(position);
		}
	}

	public isSynchronized (): boolean
	{
		return this.synchronized;
	}

	private mapPosition (position: number)
	{
		return Math.round((position * this.startAt) / this.externalDeviceStartAt);
	}
}
