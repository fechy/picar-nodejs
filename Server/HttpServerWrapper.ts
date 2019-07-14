import { readFile } from 'fs';
import * as Mustache from "mustache";
import { join } from "path";
import * as express from 'express'
import * as proxy from 'express-http-proxy';

const PORT = 3000;

export class HttpServerWrapper {

	public serve (data: IHomepageTemplateVariables): express.Application {
		const { staticsPath } = data;

		const app = express();

		app.get('/', async (req, res) => {
			const indexHtml = await this.loadIndex(data)
			res.set("content-type", "text/html");
			res.send(indexHtml);
		});

		app.use('/stream', proxy('http://localhost:8081'));

		app.get('*', (req, res) => {
			const filePath = join(staticsPath, req.path)
			res.sendFile(filePath);
		});

		app.listen(PORT, () => {
			console.log(`Ready on port ${PORT}`);
		});

		return app;
	}

	private loadIndex (data: IHomepageTemplateVariables): Promise<string>
	{
		return new Promise<string>((resolve, reject) => {
			readFile('./index.html','utf8', (err, html) => {
				if (err) {
					reject(err);
				}

				resolve(Mustache.render(html, {...data}));
			});
		});
	}
}

export interface IHomepageTemplateVariables
{
	gamepadSocketAddress: string,
	gamepadSocketPort: number,
	webcamSocketAddress?: string,
	webcamSocketPort?: number,
	staticsPath?: string
}
