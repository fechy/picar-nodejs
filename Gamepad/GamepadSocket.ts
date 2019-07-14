import * as SocketIO from 'socket.io';
import { Car } from '../Car';
import { Server } from 'http';

export class GamepadSocket
{
	public listen (address: string, port: number, car: Car): void
	{
		const io = SocketIO.listen(
			new Server().listen(port, () => {
				console.log(`GamePad socket listening on port ${port}`);
			})
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
