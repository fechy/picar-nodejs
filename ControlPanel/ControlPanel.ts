import { IControlPanelOptions } from './IControlPanelOptions';
import { Car, createCar } from '../Car';
import { createGamepadSocket } from '../Gamepad';
import { createWebCamSocket } from '../Webcam';
import { IGStreamServerOptions, createGStreamServer, createHttp2ServerWrapper } from '../Server';

export class ControlPanel
{
	private options: IControlPanelOptions;
	private readonly gstreamOptions: IGStreamServerOptions;

	public constructor (options: IControlPanelOptions, gstreamOptions: IGStreamServerOptions)
	{
		this.options = options;
		this.gstreamOptions = gstreamOptions;
	}

	public startComponents ()
	{
		const car: Car = createCar();

		const webServer = createHttp2ServerWrapper();
		const gamepadSocket = createGamepadSocket();

		// const gStreamCamProcess = gStreamServer.start(
		// 	this.options.gStreamTcpAddress,
		// 	this.options.gStreamTcpPort
		// );

		// gStreamCamProcess.stdout.on('data', (data) => {

		// 	if (data.toString().includes('Setting pipeline to PLAYING') > 0) {

		// 		webcamSocket.wrapGStreamBroadcast(
		// 			this.options.gStreamTcpAddress,
		// 			this.options.gStreamTcpPort,
		// 			this.options.webcamSocketAddress,
		// 			this.options.webcamSocketPort
		// 		);
		// 	}
		// });

		// gStreamCamProcess.stderr.on('data', (data) => {
		// 	console.log(`Webcam server error: ${data}`);
		// });

		// gStreamCamProcess.on('error', (err) => {
		// 	console.log(`Webcam server error: ${err}`);
		// });

		// gStreamCamProcess.on('exit', (code) => {
		// 	console.log(`Webcam server exited: ${code}`);
		// });

		car.on('car:ready', () => {
			gamepadSocket.listen(
				this.options.gamepadSocketAddress,
				this.options.gamepadSocketPort,
				car
			);
		});

		// car.on('car:stop', () => gStreamCamProcess.kill());

		car.start();

		webServer.serve({
			gamepadSocketAddress: this.options.gamepadSocketAddress,
			gamepadSocketPort: this.options.gamepadSocketPort,
			webcamSocketAddress: this.options.webcamSocketAddress,
			webcamSocketPort: this.options.webcamSocketPort,
			staticsPath: this.options.staticsPath
		});
	}
}
