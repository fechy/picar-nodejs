import * as SocketIO from "socket.io";
import * as Http from "http";
import { Car } from "./BoardComponents/Car";

export class GamepadSocket
{
	public listen (server: Http.Server, car: Car)
	{
		const io = SocketIO.listen(server);

		io.sockets.on('connection', (socket) => {

			socket.on('buttons:state', (buttonsState) => {

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

				if (buttonsState.a){
					car.panRight();
				}

				if (buttonsState.b){
					car.tiltDown();
				}

				if (buttonsState.x){
					car.tiltUp();
				}

				if (buttonsState.y){
					car.panLeft();
				}

				if (buttonsState.yCenter) {
					car.stop();
				}

				if (buttonsState.xCenter) {
					car.turnForward();
				}

			});
		});
	}
}
