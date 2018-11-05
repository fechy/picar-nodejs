import * as SocketIO from 'socket.io';
import { Car } from '../Car';
import { createHttpsServer } from "../Server";

export class GamepadSocket
{
	public listen (address: string, port: number, car: Car): void
	{
		const io = SocketIO.listen(
			createHttpsServer().listen(port, address)
		);

		io.sockets.on('connection', (socket) => {

			socket.on('buttons:state:manual', (buttonsState) => {

				if (buttonsState.up) {
					car.goForward();
				}

				if (buttonsState.down) {
					car.goReverse();
				}

				if (buttonsState.rt) {
					car.speedUp();
				}

				if (buttonsState.lt) {
					car.speedDown();
				}

				if (buttonsState.left) {
					car.turnLeft();
				}

				if (buttonsState.right) {
					car.turnRight();
				}

				if (buttonsState.a && !car.isPanSynchronized()){
					car.panRight();
				}

				if (buttonsState.b && !car.isTiltSynchronized()){
					car.tiltDown();
				}

				if (buttonsState.x && !car.isTiltSynchronized()){
					car.tiltUp();
				}

				if (buttonsState.y && !car.isPanSynchronized()){
					car.panLeft();
				}

				if (buttonsState.start) {
					car.centerPanTil();
				}

				if (buttonsState.yCenter) {
					car.stop();
				}

				if (buttonsState.xCenter) {
					car.turnForward();
				}

			});

			socket.on('buttons:state:cardboard', (buttonsState) => {
				if (car.isPanSynchronized() && buttonsState.pan) {
					car.panTo(buttonsState.pan);
				}

				if (car.isTiltSynchronized() && buttonsState.tilt) {
					car.tiltTo(buttonsState.tilt)
				}
			});

			socket.on('synchronize:pan', (startingPoint) => {
				car.synchronizePan(startingPoint);
			});

			socket.on('synchronize:tilt', (startingPoint) => {
				car.synchronizeTilt(startingPoint);
			});
		});
	}
}
