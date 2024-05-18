"use client"
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import { useRef, useEffect, useState } from 'react';
import {
    load as cocoSSDLoad,
    type ObjectDetection,
  } from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam';

export default function Home() {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>()
  const webcamRef = useRef<Webcam>(null);
  let detectInterval: NodeJS.Timer;

  async function runCocoSsd(){
    const net = await cocoSSDLoad();
    detectInterval = setInterval(() => {
      runObjectDetection(net);
    }, 1000);
  }

  async function runObjectDetection(net: ObjectDetection) {
    if( webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4){
    const objectDetected = await net.detect(
      webcamRef.current.video,
      undefined,
      0.5
    )
    objectDetected.forEach((o) => {
      if(o.class === "person"){
        // send data to azure blob storage
        alert("i see you") // remove this then 
      }
    })

  }
}


  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);
      });
      runCocoSsd()

      return () => {
        tf.disposeVariables()
    }

  }, []);

  return (
    <div>
      {cameras && cameras.map((camera, index) => (
        <Webcam
          audio={false}
          videoConstraints={{
            deviceId: camera.deviceId,
          }}
          ref={webcamRef}
          key={index}
        />
      ))}
    </div>
  );
}