import { CarFactory } from './Car/';
import { GamepadSocket } from './Gamepad';
import { ServerFactory } from './Server';
import { WebcamFactory } from './Webcam/';

export class Factory
{
	public createCarFactory(): CarFactory
	{
		return new CarFactory();
	}

	public createGamepadSocket (): GamepadSocket
	{
		return new GamepadSocket();
	}

	public createServerFactory () : ServerFactory
	{
		return new ServerFactory();
	}

	public createWebcamFactory (): WebcamFactory
	{
		return new WebcamFactory();
	}
}
