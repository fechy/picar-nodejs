import { createServer as newHttpServer, Server as HttpServer } from "http";
import { readFileSync } from "fs";

import { GStreamServer } from './GStreamServer';
import { HttpServerWrapper } from "./HttpServerWrapper";
import { IGStreamServerOptions } from './IGStreamServerOptions';

export function createGStreamServer (options: IGStreamServerOptions): GStreamServer
{
	return new GStreamServer(options);
}

export function createExpressServerWrapper (): HttpServerWrapper
{
	return new HttpServerWrapper();
}

/**
 * @deprecated
 */
export function createHttpServer (): HttpServer
{
	return newHttpServer()
}