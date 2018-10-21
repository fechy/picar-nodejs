import { constants, Http2SecureServer, IncomingHttpHeaders, ServerHttp2Stream } from 'http2';
import { readFile } from 'fs';
import * as Mustache from "mustache";
import { join } from "path";

import { createHttp2SecureServer, createHttpServerRedirectToHttps } from './ServerFactory';

const mime = require('mime-types');
const {
	HTTP2_HEADER_PATH,
	HTTP2_HEADER_METHOD,
	HTTP_STATUS_NOT_FOUND,
	HTTP_STATUS_INTERNAL_SERVER_ERROR
} = constants;

const SECURE_PORT = 443;
const UNSECURE_PORT = 80;

export class Http2ServerWrapper {

	public serve (data: IHomepageTemplateVariables): Http2SecureServer {

		createHttpServerRedirectToHttps().listen(UNSECURE_PORT);

		const server: Http2SecureServer = createHttp2SecureServer();

		server.on('stream', (stream: ServerHttp2Stream, headers: IncomingHttpHeaders) => {

			const reqPath = headers[HTTP2_HEADER_PATH] as string;
			const serverRoot = `${__dirname}/../`;
			const fullPath = join(serverRoot, reqPath);
			const responseMimeType = mime.lookup(fullPath);

			if (reqPath === '/') {
				this.loadIndex(data)
					.then((indexHtml) => {
						stream.respond({"content-type": "text/html"});
						stream.end(indexHtml);
					});
			} else {
				stream.respondWithFile(fullPath, {
					'content-type': responseMimeType
				}, {
					onError: (err: NodeJS.ErrnoException) => this.respondToStreamError(err, stream)
				});
			}
		});

		server.listen(SECURE_PORT);

		return server;
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

	private respondToStreamError(err: NodeJS.ErrnoException, stream: ServerHttp2Stream) {
		console.log(err);
		if (err.code === 'ENOENT') {
			stream.respond({ ":status": HTTP_STATUS_NOT_FOUND });
		} else {
			stream.respond({ ":status": HTTP_STATUS_INTERNAL_SERVER_ERROR });
		}
		stream.end();
	}
}

export interface IHomepageTemplateVariables
{
	gamepadSocketAddress: string,
	gamepadSocketPort: number,
	webcamSocketAddress?: string,
	webcamSocketPort?: number
}
