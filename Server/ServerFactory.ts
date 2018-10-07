import { GStreamServer } from './GStreamServer';
import { IGStreamServerOptions } from './IGStreamServerOptions';
import { WebServer } from './WebServer';

export class ServerFactory
{
	public getGStreamServer (options: IGStreamServerOptions): GStreamServer
	{
		return new GStreamServer(options);
	}

	public createWebServer (): WebServer
	{
		return new WebServer();
	}
}
