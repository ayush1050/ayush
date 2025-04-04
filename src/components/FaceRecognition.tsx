"use client";

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { FaceMesh } from "@mediapipe/face_mesh";
import * as tf from "@tensorflow/tfjs";
import { drawConnectors } from "@mediapipe/drawing_utils";
import {
  FACEMESH_TESSELATION,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_FACE_OVAL,
  FACEMESH_LIPS,
} from "@mediapipe/face_mesh";

const FaceRecognition: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [faceMeshModel, setFaceMeshModel] = useState<FaceMesh | null>(null);
  const [tfModel, setTfModel] = useState<tf.GraphModel | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Load TensorFlow.js model (replace with your actual path)
        const loadedTfModel = await tf.loadGraphModel("/model/model.json");
        setTfModel(loadedTfModel);

        // Initialize MediaPipe FaceMesh
        const faceMesh = new FaceMesh({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          },
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults((results) => {
          drawFaceMesh(results);
        });

        setFaceMeshModel(faceMesh);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    const drawFaceMesh = (results: any) => {
      const canvasElement = canvasRef.current;
      if (!canvasElement || !webcamRef.current?.video) return;

      const canvasCtx = canvasElement.getContext("2d");
      if (!canvasCtx) return;

      // Clear canvas and set size
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasElement.width = webcamRef.current.video.videoWidth;
      canvasElement.height = webcamRef.current.video.videoHeight;

      // Draw video feed
      canvasCtx.drawImage(
        webcamRef.current.video,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // Draw face mesh landmarks
      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
            color: "#C0C0C070",
            lineWidth: 1,
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {
            color: "#FF0000",
            lineWidth: 2,
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {
            color: "#FF0000",
            lineWidth: 2,
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {
            color: "#00FF00",
            lineWidth: 2,
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {
            color: "#00FF00",
            lineWidth: 2,
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {
            color: "#0000FF",
            lineWidth: 2,
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {
            color: "#FFFF00",
            lineWidth: 2,
          });
        }
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (faceMeshModel && webcamRef.current) {
      const interval = setInterval(() => {
        if (webcamRef.current?.video) {
          faceMeshModel.send({ image: webcamRef.current.video });
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [faceMeshModel]);

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc || null);
    }
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
        }}
        mirrored={true}
        screenshotFormat="image/png"
      />

      <canvas
        ref={canvasRef}
        className="output_canvas"
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
        }}
      ></canvas>
      <button onClick={captureImage}>Capture & Save</button>

      {capturedImage && <img src={capturedImage} alt="Captured" width="300" />}
    </div>
  );
};

export default FaceRecognition;
// export default FaceRecognition