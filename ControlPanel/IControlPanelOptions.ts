import { IGStreamServerOptions } from '../Server';

export interface IControlPanelOptions {
	gStreamTcpAddress: string;
	gStreamTcpPort: number;
	uiAddress: string
	uiPort: number;
	broadcastAddress: string;
	broadcastPort: number;
	gStreamServerOptions: IGStreamServerOptions;
}
