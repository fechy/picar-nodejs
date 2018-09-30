import { SocketWebCamWrapper } from "./SocketWebCamWrapper";
import { GStreamServer } from "./GStreamServer";
import { GStreamServerOptions } from "./GStreamServerOptions";

export class Factory
{
	public getSocketWebCamWrapper (): SocketWebCamWrapper
	{
		return new SocketWebCamWrapper()
	}

	public getGStreamServer (options: GStreamServerOptions): GStreamServer
	{
		return new GStreamServer(options);
	}
}
