import { FaceMesh,  NormalizedLandmark } from "@mediapipe/face_mesh"; // Importing FaceMesh from MediaPipe


// Initialize FaceMesh
const faceMesh = new FaceMesh({
  locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`, // Explicitly typing the parameter


});

// Face shape classification
const suggestGlassesFrame = (landmarks: NormalizedLandmark[], analyzeFaceShape: (landmarks: any) => string): string => {

  if (!landmarks || landmarks.length < 468) return "rectangular";  
  const faceShape = analyzeFaceShape(landmarks); // Analyze face shape


  const forehead = landmarks[10]; // Upper forehead
  const chin = landmarks[152]; // Chin
  const leftCheek = landmarks[234];
  const rightCheek = landmarks[454];

  if (!forehead || !chin || !leftCheek || !rightCheek) return "rectangular";

  // Width-to-height ratio
  const faceWidth = Math.abs(leftCheek.x - rightCheek.x);
  const faceHeight = Math.abs(forehead.y - chin.y);
  const ratio = faceWidth / faceHeight;

  if (ratio > 1.2) return "round";
  if (ratio < 0.8) return "rectangular";
  return "aviator";
};

export { faceMesh, suggestGlassesFrame };
