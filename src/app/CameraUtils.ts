export const setupCamera = async (): Promise<HTMLVideoElement> => {
  const video = document.createElement('video');
  video.style.position = 'absolute';
  video.style.left = '0';
  video.style.top = '0';
  video.style.width = '100%';
  video.style.height = '100%';
  
 
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      await new Promise((resolve) => (video.onloadedmetadata = resolve));
      video.play();
 
  return video;
};
