"use client";

import React from "react";
import Homepage from "../components/Homepage"; // ✅ Ensure correct import path

export default function Home() {
  return (
    <div>
      <h1>Welcome to Face Detection App</h1>
      <Homepage /> {/* ✅ Use the imported Homepage component */}
    </div>
  );
}
