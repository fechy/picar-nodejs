import * as Net from 'net';
import * as SocketIO from 'socket.io';

import { createHttpServer } from "../Server";

const Dicer = require('dicer');

export class WebcamSocket {

	public wrapGStreamBroadcast (
		gStreamTcpAddress: string,
		gStreamTcpPort: number,
		webcamSocketAddress: string,
		webcamSocketPort: number
	): void {
		const socket = new Net.Socket();

		socket.connect(gStreamTcpPort, gStreamTcpAddress, () => {
			const io = SocketIO.listen(
				createHttpServer()
					.listen(webcamSocketPort, webcamSocketAddress)
			);

			const dicer = new Dicer({
				boundary: '--videoboundary'
			});

			dicer.on('part', (part: any) => {
				let frameEncoded = '';
				part.setEncoding('base64');

				part.on('data', (data: any) => {
					frameEncoded += data;
				});

				part.on('end', () => {
					io.sockets.emit('image', frameEncoded);
				});
			});

			dicer.on('error', (e: Error) => {
				console.log(`Dicer error: ${webcamSocketAddress}:${webcamSocketPort}\n`, e);
			});

			dicer.on('finish', () => {
				console.log(`Dicer finished: ${webcamSocketAddress}:${webcamSocketPort}`);
			});

			socket.on('close', () => {
				console.log(`Socket closed: ${webcamSocketAddress}:${webcamSocketPort}`);
			});

			socket.pipe(dicer);
		});
	}
}
