import React, { useEffect } from 'react';
import getConfig from './config';

import GamePad from './GamePad';
import Webcam from './Webcam';
import Cardboard from './Cardboard';

const { webcamSocketAddress, webcamSocketPort, gamepadSocketAddress, gamepadSocketPort } = getConfig();

function handleDeviceOrientation (event) {
  panTilt = processGyro(event.alpha, event.gamma);

  if (!isPanTiltSynchronized) {
    isPanTiltSynchronized = true;
    synchronizePanTilt();
  }
}

function synchronizePanTilt () {
  if (panTilt) {
    socketGamepad.emit('synchronize:pan', panTilt.x);
    socketGamepad.emit('synchronize:tilt', panTilt.y);
  }
}

function processGyro(alpha, gamma) {
  const lookingUp = gamma >= 0 && gamma <= 90;

  return {
    x: Math.round(lookingUp ? alpha >= 180 ? alpha - 180 : alpha + 180 : alpha),
    y: Math.round(lookingUp >= 0 && gamma <= 90 ? 180 - gamma : -gamma)
  }
}

function Init() {
  let controlManual = true;
  let controlCardboard = false;

  let isRequestedAnimationFrame = false;

  const cardboardToggler = document.querySelector('.toggle-cardboard');

  let isPanTiltSynchronized = false;
  let panTilt = null;

  // Alpha = X = in landscape is left-right
  // Gamma = Y = in landscape is up-down
  if (window.DeviceOrientationEvent) {
    cardboardToggler.classList.remove('hide');
    window.addEventListener("deviceorientation", (event) => handleDeviceOrientation(event));
  }

  cardboardToggler.addEventListener('click', function () {
    cardboardToggler.classList.toggle('is-active');
    controlManual = !controlManual;
    controlCardboard = !controlCardboard;
    if (controlCardboard && !isRequestedAnimationFrame) {
      window.requestAnimationFrame(() => gamepadListener());
    }

    if (controlCardboard) {
      synchronizePanTilt();
    }
  });
}

const App = () => {
  useEffect(() => {
    window.addEventListener('gamepadconnected', function (event) {
      console.log('Game controller connected');
    });

    Init(webcamSocketAddress, webcamSocketPort);

    return () => {
      
    }
  }, []);

  return (
    <div className="feed">
      <Webcam address={webcamSocketAddress} port={webcamSocketPort} />
      <GamePad gamepadSocketAddress={gamepadSocketAddress} gamepadSocketPort={gamepadSocketPort} />
      <Cardboard />
		</div>
  )
}

export default App;