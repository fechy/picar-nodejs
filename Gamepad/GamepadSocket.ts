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

		io.sockets.on('connection', (socket: SocketIO.Socket) => {
			socket.on('buttons:state:manual', (buttonsState: any) => {

				if (buttonsState.forward) {
					car.goForward();
				} else if (buttonsState.backward) {
					car.goReverse();
				} else {
					car.stop();
				}

				if (buttonsState.left) {
					car.turnLeft();
				} else if (buttonsState.right) {
					car.turnRight();
				} else if (buttonsState.center) {
					car.turnForward();
				}

				if (buttonsState.panUp) {
					car.tiltUp();
				} else if (buttonsState.panDown) {
					car.tiltDown();
				}

				if (buttonsState.panLeft) {
					car.panLeft();
				} else if (buttonsState.panRight) {
					car.panRight();
				}
				
				if (buttonsState.panReset) {
					car.centerPanTil();
				}

				if (buttonsState.speedUp) {
					car.speedUp();
				} else if (buttonsState.speedDown) {
					car.speedDown();
				}

				// if (buttonsState.up) {
				// 	car.goForward();
				// }

				// if (buttonsState.down) {
				// 	car.goReverse();
				// }

				// if (buttonsState.rt) {
				// 	car.speedUp();
				// }

				// if (buttonsState.lt) {
				// 	car.speedDown();
				// }

				// if (buttonsState.left) {
				// 	car.turnLeft();
				// }

				// if (buttonsState.right) {
				// 	car.turnRight();
				// }

				// if (buttonsState.a && !car.isPanSynchronized()){
				// 	car.panRight();
				// }

				// if (buttonsState.b && !car.isTiltSynchronized()){
				// 	car.tiltDown();
				// }

				// if (buttonsState.x && !car.isTiltSynchronized()){
				// 	car.tiltUp();
				// }

				// if (buttonsState.y && !car.isPanSynchronized()){
				// 	car.panLeft();
				// }

				// if (buttonsState.start) {
				// 	car.centerPanTil();
				// }

				// if (buttonsState.yCenter) {
				// 	car.stop();
				// }

				// if (buttonsState.xCenter) {
				// 	car.turnForward();
				// }

			});

			socket.on('buttons:state:cardboard', (buttonsState:any) => {
				if (car.isPanSynchronized() && buttonsState.pan) {
					car.panTo(buttonsState.pan);
				}

				if (car.isTiltSynchronized() && buttonsState.tilt) {
					car.tiltTo(buttonsState.tilt)
				}
			});

			socket.on('synchronize:pan', (startingPoint: number) => {
				car.synchronizePan(startingPoint);
			});

			socket.on('synchronize:tilt', (startingPoint:number) => {
				car.synchronizeTilt(startingPoint);
			});
		});
	}
}
