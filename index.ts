import { ControlPanel, IControlPanelOptions } from './ControlPanel';
import { Factory } from './Factory';
import { IGStreamServerOptions } from './Server';

const gStreamServerOptions: IGStreamServerOptions = {
	deviceIndex: -1,
	fake: false,
	frameRate: 10,
	grayScale: false,
	height: 600,
	width: 800
};

const controlPanelOptions: IControlPanelOptions = {
	gStreamTcpAddress: '192.168.0.17',
	gStreamTcpPort: 10000,
	uiAddress: '192.168.0.17',
	uiPort: 11000,
	broadcastAddress: '192.168.0.17',
	broadcastPort: 12000,
	gStreamServerOptions: gStreamServerOptions
};

const controlPanel = new ControlPanel(new Factory(), controlPanelOptions);
controlPanel.startComponents();
