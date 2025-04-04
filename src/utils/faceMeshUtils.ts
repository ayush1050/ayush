"use client";
import * as faceapi from "face-api.js";

/** Load FaceMesh Model */
export async function loadFaceMesh() {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  console.log("✅ FaceMesh model loaded.");
}

/** Detect Faces in the Given Video Element */
export async function detectFaces(video: HTMLVideoElement, faceMeshRef: any) {
  if (!video) return null; // Corrected: Check the passed video argument

  const detections = await faceapi.detectAllFaces(
    video, // Corrected: Use the passed video argument
    new faceapi.TinyFaceDetectorOptions()
  );
  return detections;
}

/** Predict Face Shape using TensorFlow.js Model */
export async function predictFaceShape(imageData: any) {
  // Your TensorFlow.js Model Logic Here (if needed)
  return analyzeFaceShape(imageData.landmarks);
}

/** Suggest Glasses Frame Based on Face Shape */
export function suggestGlassesFrame(faceShape: string) {
  const frameSuggestions: { [key: string]: string } = {
    square: "Round or Oval Frames",
    round: "Rectangular or Geometric Frames",
    oval: "Any Frame Works Well",
    heart: "Bottom-Heavy Frames",
  };

  return frameSuggestions[faceShape] || "Standard Frames";
}

export function analyzeFaceShape(landmarks: any) {
  if (!landmarks || landmarks.length === 0) {
    console.warn("⚠️ No landmarks detected.");
    return "unknown";
  }

  const faceWidth = landmarks[454].x - landmarks[234].x;
  const faceHeight = landmarks[10].y - landmarks[152].y;
  const ratio = faceWidth / faceHeight;

  console.log("📏 Face Width:", faceWidth, "Height:", faceHeight, "Ratio:", ratio);

  if (ratio > 0.85) return "square";
  if (ratio > 0.75) return "round";
  if (ratio > 0.65) return "oval";
  return "heart";
}