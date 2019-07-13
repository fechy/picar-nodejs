import React, { useEffect, useState, useRef } from 'react';
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const colors = {
  ["person"]: "#FF0000",
}

const Webcam = () => {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const renderPredictions = predictions => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Font options.
    const font = "12px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];

      const color = colors[prediction.class] || "#00FFFF";

      // Draw the bounding box.
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);

      // Draw the label background.
      ctx.fillStyle = color;
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 8); // base 10
      ctx.fillRect(x, y, textWidth + 1, textHeight + 1);
    });

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];

      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
    });
  };

  const detectFrame = (model) => {
    if (model) {
      model.detect(imageRef.current)
        .then(renderPredictions);
    }
  };

  async function initializeModel(image) {
    const model = await cocoSsd.load('lite_mobilenet_v2');

    const predictions = await model.detect(image);
    renderPredictions(predictions);

    setInterval(async () => {
      const predictions = await model.detect(image);
      renderPredictions(predictions);
    }, 100);
  }

  useEffect(() => {
    if (imageRef.current) {
      initializeModel(imageRef.current);
    }

    return () => {
      
    }
  }, [imageRef]);

  return (
    <div>
      <img ref={imageRef} className="fixed" width="640" height="480" src={`/stream`} alt="no signal" crossOrigin="anonymous" />
      <canvas ref={canvasRef} className="fixed" width="640" height="480" />
    </div>
  )
}

export default Webcam;