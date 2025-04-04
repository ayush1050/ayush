"use client";
import { useRef, useEffect } from "react";

export default function Homepage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current!.srcObject = stream;
        })
        .catch((err) => console.error("Camera access error:", err));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold">Face Detection App</h1>
        <p className="text-lg mt-2 text-gray-300">Detect & analyze faces in real-time</p>
      </header>

      <div className="relative w-full max-w-2xl">
        <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg shadow-lg"></video>
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <p className="text-white text-lg">Face Mesh Loading...</p>
        </div>
      </div>

      <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg">
        Start Detection
      </button>

      <footer className="mt-10 text-sm text-gray-400">© 2025 Face Detection App</footer>
    </div>
  );
}
