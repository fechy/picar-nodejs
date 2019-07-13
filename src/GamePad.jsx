import React, { useEffect } from 'react';

let isRequestedAnimationFrame = false;

function gamepadListener (socketGamepad)
{
  if (!isRequestedAnimationFrame) {
    isRequestedAnimationFrame = true;
  }

  const gamepad = navigator.getGamepads()[0];

  // gamepad.buttons.map((btn, i) => {
  // 	if (btn.pressed) {
  // 		console.log(`Button ${i} pressed`);
  // 	}
  // })

  if (gamepad) {
    const gamepadState = {
      left: gamepad.axes[0] === -1,
      right: gamepad.axes[0] === 1,
      xCenter: gamepad.axes[0] === 0,
      up: gamepad.axes[1] === -1,
      down: gamepad.axes[1] === 1,
      yCenter: gamepad.axes[1] === 0,
      center: gamepad.buttons[10].pressed,

      panLeft: gamepad.axes[2] === -1,
      panRight: gamepad.axes[2] === 1,
      panUp: gamepad.axes[3] === -1,
      panDown: gamepad.axes[3] === 1,
      panReset: gamepad.buttons[11].pressed,

      /**
        star = 3
        square = 2
        x = 0
        circle = 1

        L1 = 4
        L2 = 6
        R1 = 5
        R2 = 7
      */
      speedUp: gamepad.buttons[4].pressed,
      speedDown: gamepad.buttons[6].pressed,
      forward: gamepad.buttons[1].pressed,
      backward: gamepad.buttons[0].pressed,

      a: gamepad.buttons[0].pressed,
      b: gamepad.buttons[1].pressed,
      x: gamepad.buttons[3].pressed,
      y: gamepad.buttons[4].pressed,
      lt: gamepad.buttons[6].pressed,
      rt: gamepad.buttons[7].pressed,
      start: gamepad.buttons[11].pressed,
      select: gamepad.buttons[10].pressed
    };

    socketGamepad.emit('buttons:state:manual', gamepadState);
  }

  // if (controlCardboard && panTilt) {

  //   const gamepadState = {
  //     pan: panTilt.x,
  //     tilt: panTilt.y
  //   };

  //   socketGamepad.emit('buttons:state:cardboard', gamepadState);
  // }

  window.requestAnimationFrame(() => gamepadListener(socketGamepad));
}

const GamePad = ({ gamepadSocketAddress, gamepadSocketPort }) => {
  useEffect(() => {
    const socketGamepad = io.connect(`https://${gamepadSocketAddress}:${gamepadSocketPort}`);

    window.addEventListener('gamepadconnected', function (event) {
      const gamepad = navigator.getGamepads()[event.gamepad.index];
      console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
        gamepad.index, gamepad.id,gamepad.buttons.length, gamepad.axes.length
      );
  
      if (!isRequestedAnimationFrame) {
        window.requestAnimationFrame(() => gamepadListener(socketGamepad));
      }
    });

    return () => {

    }
  }, [ gamepadSocketAddress, gamepadSocketPort ]);


  return (
    <div style={{ display: 'none' }}>Gamepad</div>
  )
}

export default GamePad;