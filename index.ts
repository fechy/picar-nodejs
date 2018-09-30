/*
import * as http from 'http';
import * as fs from 'fs';

import { Factory } from './Factory';

const server = http.createServer(handler);
server.listen(8080);

const factory = new Factory();

const board = factory.createRaspiBoard();

board.on("ready", () => {

	console.log('Ready');

	const motors = factory.createMotor();

	/!*board.repl.inject({
		motors: motors
	});*!/
/!*
	// Go forward at full speed for 5 seconds
	console.log("Full speed ahead!");
	motors.forward(255);
	board.wait(5000, () => {
		console.log("Stop motors!");
		motors.stop();
		// Go backwards at full speed for 5 seconds
		console.log("Now backwards!");
		motors.reverse(255);
		board.wait(5000, () => {
			console.log("Stop motors!");
			motors.stop();
		});
	});*!/
/!*
	// Go left...
	console.log("To the left!");
	motors[0].reverse(200);
	motors[1].forward(200);
	board.wait(5000, () => {
		motors.stop();
	});

	// Go right...
	console.log("To the right!");
	motors[0].forward(200);
	motors[1].reverse(200);
	board.wait(5000, () => {
		motors.stop();
	});*!/


	board.on('exit', () => {
		console.log('Ciao');
		motors.stop();
	});

});

function handler (req, res)
{
	fs.readFile(__dirname + '/index.html', function(err, data) { //read file index.html in public folder
		if (err) {
			res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
			return res.end("404 Not Found");
		}
		res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
		res.write(data); //write data from index.html
		return res.end();
	});
}

*/

import { ControlPanel } from './Backend/ControlPanel';
import { ControlPanelOptions } from "./Backend/ControlPanelOptions";
import { GStreamServerOptions } from "./Backend/Webcam/GStreamServerOptions";
import { Factory } from "./Backend/Factory";
import { Factory as BoardComponentsFactory } from "./Backend/BoardComponents/Factory";
import { Factory as WebcamFactory } from "./Backend/Webcam/Factory";

const gStreamServerOptions: GStreamServerOptions = {
	deviceIndex: -1,
	fake: false,
	frameRate: 10,
	grayScale: false,
	height: 600,
	width: 800
};

const controlPanelOptions: ControlPanelOptions = {
	gStreamTcpAddress: "192.168.0.17",
	gStreamTcpPort: 10000,
	uiAddress: "192.168.0.17",
	uiPort: 11000,
	broadcastAddress: "192.168.0.17",
	broadcastPort: 12000,
	start: () => {},
	gStreamServerOptions: gStreamServerOptions
};

const factory = new Factory();
const boardComponentsFactory = new BoardComponentsFactory();
const webcamFactory = new WebcamFactory();
const controlPanel = new ControlPanel(
	factory,
	boardComponentsFactory,
	webcamFactory,
	controlPanelOptions
);

controlPanel.startComponents();
