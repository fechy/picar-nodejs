import * as OS from 'os';

import { GStream } from '../Webcam';
import { IGStreamServerOptions } from './IGStreamServerOptions';

export class GStreamServer
{
	private config: IGStreamServerOptions;
	private readonly videoSrc: string;

	public constructor(config: IGStreamServerOptions) {

		this.config = config;

		if (!this.config.fake) {
			if (OS.platform() == 'win32')
				this.videoSrc = `ksvideosrc device-index=${this.config.deviceIndex} ! decodebin`;
			else if (OS.platform() == 'linux')
				this.videoSrc = 'v4l2src ! decodebin';
			else if (OS.platform() == 'darwin')
				this.videoSrc = `avfvideosrc device-index=${this.config.deviceIndex}`;
			else
				throw new Error('unsupported platform');
		} else {
			this.videoSrc = 'videotestsrc';
		}

		if (this.config.width > 0 || this.config.height > 0) {
			this.videoSrc += ` ! videoscale ! video/x-raw,width=${this.config.width},height=${this.config.height}`
		}

		if (this.config.frameRate > 0) {
			this.videoSrc += ` ! videorate ! video/x-raw,framerate=${this.config.frameRate}/1`;
		}

		if (this.config.grayScale) {
			this.videoSrc += ' ! videobalance saturation=0.0 ! videoconvert';
		}
	}

	public start (tcpAddress: string, tcpPort: number)
	{
		const camPipeline = `${this.videoSrc} ! jpegenc ! multipartmux  boundary="--videoboundary" ! tcpserversink host=${tcpAddress} port=${tcpPort}`;
		const gStream = new GStream();

		return gStream.spawnPipeline(camPipeline);
	}
}
