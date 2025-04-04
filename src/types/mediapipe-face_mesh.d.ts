declare module "@mediapipe/face_mesh" {
  export interface NormalizedLandmark {
    x: number;
    y: number;
    z: number;
  }

  export interface FaceMeshResults {
    multiFaceLandmarks: NormalizedLandmark[][]; // Array of face landmark points
  }

  export class FaceMesh {
    constructor(config?: { locateFile?: (file: string) => string });

    setOptions(options: {
      maxNumFaces?: number;
      refineLandmarks?: boolean;
      minDetectionConfidence?: number;
      minTrackingConfidence?: number;
    }): void;

    onResults(callback: (results: FaceMeshResults) => void): void;

    send(input: { image: HTMLVideoElement | HTMLImageElement }): Promise<void>;

    initialize(): Promise<void>;
  }
}
