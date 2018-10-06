window.addEventListener('gamepadconnected', (event) => {
	console.log(event);
	const gp = navigator.getGamepads()[(event as GamepadEvent).gamepad.index];
	console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
		gp.index, gp.id,
		gp.buttons.length, gp.axes.length);
});

// L:-1, R:1 -> axes[0]
// U:-1, D:1 -> axes[1]
// A -> buttons[0]
// B -> buttons[1]
// X -> buttons[3]
// Y -> buttons[4]
// LT -> buttons[6]
// RT -> buttons[7]
// Start -> buttons[11]
// Select -> buttons[10]
window.requestAnimationFrame(() => foo());

function foo ()
{
	const gp = navigator.getGamepads()[0];

	if (gp) {
		// Map buttons to object
		const gamepadState = {
			left: gp.axes[0] === -1,
			right: gp.axes[0] === 1,
			xCenter: gp.axes[0] === 0,
			up: gp.axes[1] === -1,
			down: gp.axes[1] === 1,
			yCenter: gp.axes[1] === 0,
			a: gp.buttons[0].pressed,
			b: gp.buttons[1].pressed,
			x: gp.buttons[3].pressed,
			y: gp.buttons[4].pressed,
			lt: gp.buttons[6].pressed,
			rt: gp.buttons[7].pressed,
			start: gp.buttons[11].pressed,
			select: gp.buttons[10].pressed
		};

		// Send buttons state via socket
		socketGamepad.emit('buttons:state', gamepadState);
	}

	window.requestAnimationFrame(() => foo());
}
