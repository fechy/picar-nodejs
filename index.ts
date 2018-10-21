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
	gamepadSocketAddress: '192.168.0.17',
	gamepadSocketPort: 11000,
	webcamSocketAddress: '192.168.0.17',
	webcamSocketPort: 12000
};

const controlPanel = new ControlPanel(new Factory(), controlPanelOptions, gStreamServerOptions);
controlPanel.startComponents();
