

import React, { useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

interface GlassesModelProps {
  landmarks: { x: number; y: number; z?: number }[];
  modelPath: string;
  imageWidth: number;
  imageHeight: number;
  canvasWidth: number;
  canvasHeight: number;
}

const GlassesModel: React.FC<GlassesModelProps> = ({
  landmarks,
  modelPath,
  imageWidth,
  imageHeight,
  canvasWidth,
  canvasHeight,
}) => {
  // Explicitly type the GLTF model
  const gltf = useLoader(GLTFLoader, modelPath) as unknown as { scene: THREE.Object3D };
  const glassesRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (glassesRef.current && landmarks.length >= 3) {
      const scaleX = canvasWidth / imageWidth;
      const scaleY = canvasHeight / imageHeight;

      const nose = landmarks[2];
      const leftEye = landmarks[1];
      const rightEye = landmarks[0];

      const eyeCenterX = ((leftEye.x + rightEye.x) / 2) * scaleX;
      const eyeCenterY = ((leftEye.y + rightEye.y) / 2) * scaleY;

      glassesRef.current.position.set(eyeCenterX, eyeCenterY, nose.z ?? 0.1);
      glassesRef.current.rotation.set(0, Math.PI, 0);
    }
  }, [landmarks, gltf, imageWidth, imageHeight, canvasWidth, canvasHeight]);

  return (
    <group ref={glassesRef}>
      {gltf.scene && <primitive object={gltf.scene} />}
    </group>
  );
};

export default GlassesModel;
