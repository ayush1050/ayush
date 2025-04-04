"use client";
import React, { useState, useRef, useEffect } from "react";
import { loadFaceMesh, detectFaces, predictFaceShape, suggestGlassesFrame } from "../utils/faceMeshUtils";
import * as CameraUtils from "@mediapipe/camera_utils";
import "../styles/index.css"; // Ensure correct CSS path

// Define FaceDetection interface based on what detectFaces actually returns
interface FaceDetection {
  keypoints: { x: number; y: number }[]; // Example - Adjust based on actual structure
}

// Define Face interface based on what analyzeCapturedImage requires
interface Face {
    keypoints: [number, number][]; // Array of coordinate pairs
  }

export default function Homepage() {
  const videoRef = useRef<HTMLVideoElement>(null);
    //Need to define faceMeshRef to load the facemesh
  const faceMeshRef = useRef<any>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [faceShape, setFaceShape] = useState<string | null>(null);
  const [glassesSuggestion, setGlassesSuggestion] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "faceAnalysis">("home");

  useEffect(() => {
    const initializeFaceMesh = async () => {
      //Load and await the facemeh
      faceMeshRef.current = await loadFaceMesh();
    };
    initializeFaceMesh();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);

        const camera = new CameraUtils.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              //Need to also call it with the correct faceMesh
              const faces = await detectFaces(videoRef.current, faceMeshRef.current);
              if (!Array.isArray(faces)) return;
            }
          },
          width: 640,
          height: 480,
        });

        await camera.start();
        setTimeout(captureImage, 3000);
      }
    } catch (error) {
      console.error("❌ Camera Access Failed:", error);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
        analyzeCapturedImage(canvas);
      }
    }
  };

  const analyzeCapturedImage = async (canvas: HTMLCanvasElement) => {
    if (videoRef.current && faceMeshRef.current) {
      try {
        const faces = await detectFaces(videoRef.current, faceMeshRef.current);
  
        if (faces && faces.length > 0) {
          const detectedShape = await predictFaceShape(faces[0]);
          setFaceShape(detectedShape);
          setGlassesSuggestion(suggestGlassesFrame(detectedShape));
        } else {
          console.warn("No faces detected in the captured image.");
        }
      } catch (error) {
        console.error("Error analyzing captured image:", error);
      }
    } else {
      console.error("Video or FaceMesh ref is not available");
    }
  }; 
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const handleTabChange = (tab: "home" | "faceAnalysis") => {
    setActiveTab(tab);
    if (tab === "home") stopCamera();
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#D7CCC8] text-[#6D4C41] p-6">
      <h1 className="text-4xl font-bold text-[#5C6BC0] mb-6">Face Analysis App</h1>

      {/* Tabs */}
      <div className="flex space-x-6 mb-6">
        <button
          onClick={() => handleTabChange("home")}
          className={`px-6 py-2 font-bold rounded-lg ${activeTab === "home" ? "bg-[#FFC107] text-white" : "bg-[#6D4C41] text-white"}`}
        >
          Home
        </button>
        <button
          onClick={() => handleTabChange("faceAnalysis")}
          className={`px-6 py-2 font-bold rounded-lg ${activeTab === "faceAnalysis" ? "bg-[#FFC107] text-white" : "bg-[#6D4C41] text-white"}`}
        >
          Face Analysis
        </button>
      </div>

      {/* Home Tab */}
      {activeTab === "home" && (
        <div className="bg-[#FAFAFA] text-[#6D4C41] p-6 rounded-lg shadow-md max-w-lg">
          <h2 className="text-2xl font-semibold">About the App</h2>
          <p className="mt-2">
            This app helps you analyze your face shape and get AI-based glasses suggestions. Just start the camera and let the AI do the rest!
          </p>
          <h3 className="text-xl font-semibold mt-4">How to Use</h3>
          <ul className="list-disc pl-6 mt-2">
            <li>Click "Face Analysis" to begin.</li>
            <li>Start the camera and wait for auto-capture.</li>
            <li>View your face shape and recommended glasses.</li>
          </ul>
        </div>
      )}

      {/* Face Analysis Tab */}
      {activeTab === "faceAnalysis" && (
        <div className="w-full max-w-2xl">
          {/* Video Feed */}
          <div className="relative w-full mb-4">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg shadow-lg"></video>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={startCamera}
              disabled={cameraActive}
              className="bg-[#5C6BC0] hover:bg-[#3F51B5] text-white px-6 py-3 font-bold rounded-lg"
            >
              Start Camera
            </button>
            <button
              onClick={captureImage}
              disabled={!cameraActive}
              className="bg-[#FFC107] hover:bg-[#FFA000] text-white px-6 py-3 font-bold rounded-lg"
            >
              Capture Photo
            </button>
            <button
              onClick={stopCamera}
              disabled={!cameraActive}
              className="bg-[#6D4C41] hover:bg-[#5D4037] text-white px-6 py-3 font-bold rounded-lg"
            >
              Stop Camera
            </button>
          </div>

          {/* Analysis Results */}
          {capturedImage && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold">Captured Image</h2>
              <img src={capturedImage} alt="Captured" className="mt-2 rounded-lg shadow-lg w-64" />
            </div>
          )}

          {faceShape && (
            <div className="mt-6 text-center">
              <h2 className="text-2xl font-semibold">Face Analysis</h2>
              <p className="text-lg">Face Shape: <span className="font-bold">{faceShape}</span></p>
              <p className="text-lg">Glasses Suggestion: <span className="font-bold">{glassesSuggestion}</span></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
