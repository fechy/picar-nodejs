import React, { useEffect } from 'react';
import 'babel-polyfill';

import getConfig from './config';

import GamePad from './GamePad';
import Webcam from './Webcam';
import Cardboard from './Cardboard';

const { gamepadSocketAddress, gamepadSocketPort } = getConfig();

const App = () => {
  return (
    <div className="feed">
      <Webcam />
      <GamePad gamepadSocketAddress={gamepadSocketAddress} gamepadSocketPort={gamepadSocketPort} />
      <Cardboard />
		</div>
  )
}

export default App;