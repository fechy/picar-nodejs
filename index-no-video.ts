import { ControlPanelNoVideo, IControlPanelNoVideoOptions } from "./ControlPanel";

const controlPanelOptionsNoVideo: IControlPanelNoVideoOptions = {
	gamepadSocketAddress: '192.168.0.17',
	gamepadSocketPort: 11000,
};

const controlPanelNoVideo = new ControlPanelNoVideo(controlPanelOptionsNoVideo);
controlPanelNoVideo.start();
