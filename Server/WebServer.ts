import * as Http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import * as Mustache from 'mustache';

const map: any = {
	'.ico': 'image/x-icon',
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.json': 'application/json',
	'.css': 'text/css',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.wav': 'audio/wav',
	'.mp3': 'audio/mpeg',
	'.svg': 'image/svg+xml',
	'.pdf': 'application/pdf',
	'.doc': 'application/msword'
};

export class WebServer
{
	private server: Http.Server | undefined;

	public serve (uiAddress: string, uiPort: number, webcamAddress: string, webcamPort: number): Http.Server
	{
		this.close();

		this.server = Http.createServer((request, response) => {

			if (request.url === undefined) {
				this.loadIndex(uiAddress, uiPort, webcamAddress, webcamPort, response);
				return;
			}

			const parsedUrl = url.parse(request.url);
			const pathname = `.${parsedUrl.pathname}`;
			const ext = path.parse(pathname).ext;

			if (request.url === '/') {
				this.loadIndex(uiAddress, uiPort, webcamAddress, webcamPort, response);
			} else {
				fs.readFile(`./Frontend${request.url}`, (err, data) => {
					if(err){
						response.statusCode = 500;
						response.end(`Error getting the file: ${err}.`);
					} else {
						response.setHeader('Content-type', map[ext] || 'text/plain' );
						response.end(data);
					}
				});
			}
		});

		this.server.listen(uiPort, uiAddress);

		console.log('Open http://' + uiAddress + ':' + uiPort + '/ in your browser!');

		return this.server;
	}

	public close ()
	{
		if (this.server) {
			this.server.close();
			this.server = undefined;
		}
	}

	private loadIndex (
		uiAddress: string,
		uiPort: number,
		webcamAddress: string,
		webcamPort: number,
		response: Http.ServerResponse): void
	{
		fs.readFile('./index.html','utf8', (err, html) => {
			response.writeHead(200, {
				'Content-Type': 'text/html'
			});
			response.write(
				Mustache.render(html, {
					webcamAddress: webcamAddress,
					webcamPort: webcamPort,
					uiAddress: uiAddress,
					uiPort: uiPort
				})
			);
			response.end();
		});
	}
}
