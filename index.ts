import { ControlPanel, IControlPanelOptions, ControlPanelNoVideo, IControlPanelNoVideoOptions } from './ControlPanel';

import { IGStreamServerOptions } from './Server';

const [ ip, noVideo ] = process.argv.slice(2);

if (!ip) {
	showHelp();
	process.exit(1);
}

if (noVideo) {
	startControlPanelNoVideo(ip);
} else {
	startControlPanelWithVideo(ip);
}

function startControlPanelNoVideo(ip: string)
{
	const controlPanelOptionsNoVideo: IControlPanelNoVideoOptions = {
		gamepadSocketAddress: ip,
		gamepadSocketPort: 11000,
	};

	const controlPanelNoVideo = new ControlPanelNoVideo(controlPanelOptionsNoVideo);
	controlPanelNoVideo.startComponents();
}

function startControlPanelWithVideo(ip: string)
{
	const gStreamServerOptions: IGStreamServerOptions = {
		deviceIndex: -1,
		fake: false,
		frameRate: 10,
		grayScale: false,
		height: 600,
		width: 800
	};

	const controlPanelOptions: IControlPanelOptions = {
		gStreamTcpAddress: ip,
		gStreamTcpPort: 10000,
		gamepadSocketAddress: ip,
		gamepadSocketPort: 11000,
		webcamSocketAddress: ip,
		webcamSocketPort: 12000
	};

	const controlPanel = new ControlPanel(controlPanelOptions, gStreamServerOptions);
	controlPanel.startComponents();
}

function showHelp () {
	console.log(
		`
Usage: 
yarn start raspberry_ip

Example: 
yarn start 192.168.0.17

Usage without video:
yarn start 192.168.0.17 false
		`
	);
}
