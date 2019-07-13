import { createServer as newHttpServer, Server as HttpServer } from "http";
import { createServer as newHttpsServer, Server as HttpsServer } from "https";
import { createSecureServer, Http2SecureServer } from "http2";
import { readFileSync } from "fs";

import { GStreamServer } from './GStreamServer';
import { Http2ServerWrapper } from "./Http2ServerWrapper";
import { IGStreamServerOptions } from './IGStreamServerOptions';

export function createGStreamServer (options: IGStreamServerOptions): GStreamServer
{
	return new GStreamServer(options);
}

export function createHttp2ServerWrapper (): Http2ServerWrapper
{
	return new Http2ServerWrapper();
}

export function createHttp2SecureServer (): Http2SecureServer
{
	return createSecureServer({
		key: readFileSync('key.pem'),
		cert: readFileSync('cert.pem')
	});
}

export function createHttpsServer (): HttpsServer
{
	return newHttpsServer({
		key: readFileSync('key.pem'),
		cert: readFileSync('cert.pem')
	})
}

export function createHttpServerRedirectToHttps (): HttpServer
{
	return newHttpServer();
}
