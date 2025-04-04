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
  