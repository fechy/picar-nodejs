import React, { useEffect, useState } from 'react';

const Webcam = ({ address, port }) => {
  const [ image, setImage ] = useState('no-signal.png');

  useEffect(() => {
    const socketWebcam = io.connect(`https://${address}:${port}`);
    socketWebcam.on('image', function (data) {
      setImage(`data:image/jpeg;base64,${data}`);
    });

    return () => {
      
    }
  }, [address, port]);

  return (
    <img className="video" src={image} alt="no signal" />
  )
}

export default Webcam;