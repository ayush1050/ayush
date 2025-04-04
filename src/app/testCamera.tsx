"use client";

import { useEffect, useRef, useState } from "react";
import { startCamera, stopCamera } from "./CameraUtils";

const TestCamera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const start = async () => {
      if (videoRef.current) {
        const success = await startCamera(videoRef.current);
        if (!success) {
          setError("Failed to start the camera.");
          console.error("Failed to start the camera.");
        }
      }
    };

    start();

    return () => {
      if (videoRef.current) stopCamera(videoRef.current);
    };
  }, []);

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <video ref={videoRef} className="w-full rounded-lg shadow-lg" autoPlay playsInline />
    </div>
  );
};

export default TestCamera;
