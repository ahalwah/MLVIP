let videoElement = document.getElementById("input_video");
console.log(videoElement);
function onResults(results) {
  // pose detection
  if (results.poseLandmarks) {
    console.log(results.poseLandmarks);
  }
}

let pose = new Pose({
  locateFile: (file) => {
    //console.log(file);
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  },
});
pose.setOptions({
  modelComplexity: 0,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
pose.onResults(onResults);

let camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({ image: videoElement });
  },
  width: 1280,
  height: 720,
});
camera.start();
