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

				car.goForward();
				/*if (buttonsState.up) {
					car.goForward();
				} else if (buttonsState.down) {
					car.goReverse();
				} else if (buttonsState.rt) {
					car.speedUp();
				} else if (buttonsState.lt) {
					car.speedDown();
				} else if (buttonsState.yCenter) {
					car.stop();
				}*/

			});
		});
	}
}
