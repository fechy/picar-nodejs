import { WebcamSocket } from './WebcamSocket';

export class WebcamFactory
{
	public getWebCamSocket (): WebcamSocket
	{
		return new WebcamSocket()
	}
}
