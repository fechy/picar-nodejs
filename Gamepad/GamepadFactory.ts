import { GamepadSocket } from "./GamepadSocket";
import { GamepadBluetooth } from './GamepadBluetooth';

export function createGamepadSocket(): GamepadSocket
{
	return new GamepadSocket();
}

export function createGamepadBluetooth(): GamepadBluetooth
{
	return new GamepadBluetooth();
}
