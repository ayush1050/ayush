// This file exports TypeScript types and interfaces used throughout the application.

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface FaceLandmarks {
  multiFaceLandmarks: Landmark[][];
}

export interface GlassesModelProps {
  landmarks: Landmark[];
  modelPath: string;
}

export interface CameraError {
  message: string;
}