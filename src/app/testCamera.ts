"use client";

import { useEffect, useRef, useState } from "react";
import { startCamera, stopCamera } from "./CameraUtils";

const TestCamera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const start = async () => {
      if (videoRef.current) {
        const success = await startCamera(videoRef.current);
        if (!success && isMounted) {
          setError("Failed to start the camera.");
          console.error("Camera access denied or unavailable.");
        } else if (isMounted) {
          setCameraActive(true);
        }
      }
    };

    start();

    return () => {
      isMounted = false;
      if (videoRef.current) stopCamera(videoRef.current);
      setCameraActive(false);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      {error && <p className="text-red-500">{error}</p>}
      {cameraActive ? (
        <video ref={videoRef} className="w-full rounded-lg shadow-lg" autoPlay playsInline />
      ) : (
        <p className="text-gray-400">Starting camera...</p>
      )}
    </div>
  );
};

export default TestCamera;
