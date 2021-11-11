let detector;
let poses;
let video;
let width = 640,
  height = 480;
let hw = width / 2,
  hh = height / 2;

async function init() {
  const model = poseDetection.SupportedModels.BlazePose;
  const detectorConfig = {
    runtime: "tfjs", // 'tfjs' or "mediapipe"
    modelType: "heavy", // lite -> full -> heavy
  };
  detector = await poseDetection.createDetector(model, detectorConfig);
}

async function videoReady() {
  console.log("video ready");
  await getPoses();
}

async function setup() {
  createCanvas(width, height);
  video = createCapture(VIDEO, videoReady);
  video.hide();
  await init();
}

async function getPoses() {
  poses = await detector.estimatePoses(video.elt);
  //console.log(poses);
  setTimeout(getPoses, 0);
}

function draw() {
  background(220);
  image(video, 0, 0);
  if (poses && poses.length > 0)
    for (var i = 0; i < poses[0].keypoints.length; i++) {
      let x = poses[0].keypoints[i].x;
      let y = poses[0].keypoints[i].y;
      let z = poses[0].keypoints3D[i].z;
      if (
        poses[0].keypoints[i].score > 0.5 &&
        poses[0].keypoints[i].name == "right_wrist"
      ) {
        fill("green");
        stroke(0);
        strokeWeight(4);
        circle(x, y, 40);
      }
      if (poses[0].keypoints3D[i].name == "right_wrist")
        console.log("z: " + z + " scaled: " + mapping(z, -1, 1, 0, 2));
    }
}

function mapping(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
