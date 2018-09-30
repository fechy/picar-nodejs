import { GStreamServerOptions } from "./Webcam/GStreamServerOptions";

export interface ControlPanelOptions {
	gStreamTcpAddress: string;
	gStreamTcpPort: number;
	uiAddress: string
	uiPort: number;
	broadcastAddress: string;
	broadcastPort: number;
	start: () => void;
	gStreamServerOptions?: GStreamServerOptions;
}
