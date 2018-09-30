import * as Net from 'net';
import * as Http from 'http';
import * as SocketIO from 'socket.io';
import * as Dicer from 'dicer';

export class SocketWebCamWrapper {

	public wrap (
		gStreamTcpAddress: string,
		gStreamTcpPort: number,
		broadcastTcpAddress: string,
		broadcastTcpPort: number
	) {
		const socket = new Net.Socket();

		socket.connect(gStreamTcpPort, gStreamTcpAddress, () => {
			const io = SocketIO.listen(
				Http.createServer()
					.listen(broadcastTcpPort, broadcastTcpAddress)
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

			dicer.on('finish', () => {
				console.log('Dicer finished: ' + broadcastTcpAddress + ':' + broadcastTcpPort);
			});

			socket.on('close', () => {
				console.log('Socket closed: ' + broadcastTcpAddress + ':' + broadcastTcpPort);
			});

			socket.pipe(dicer);
		});
	}
}
