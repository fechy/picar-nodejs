import { WebServer } from "./WebServer";
import { GamepadSocket } from "./GamepadSocket";

export class Factory
{
	public getWebServer (): WebServer
	{
		return new WebServer();
	}

	public getGamepadSocket (): GamepadSocket
	{
		return new GamepadSocket();
	}
}
