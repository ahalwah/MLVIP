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
    modelType: "full", // lite -> full -> heavy
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
  if (poses && poses.length > 0) {
    //let z = mapping(poses[0].keypoints3D[i].z, -1, 1, 0, 2);
    axisDraw(
      poses[0].keypoints[16].x,
      poses[0].keypoints[16].y,
      poses[0].keypoints[20].x,
      poses[0].keypoints[20].y,
      poses[0].keypoints[22].x,
      poses[0].keypoints[22].y
    );
  }
}

function mapping(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function axisDraw(wx, wy, ix, iy, tx, ty) {
  let origin = { x: 0, y: 0 };
  line(wx, wy, ix, iy);
  let d = dist(wx, wy, tx, ty);
  let x = d / sqrt(2);
  if (tx - wx > 0) {
    line(tx, ty, tx - x, ty);
    origin.x = tx - x;
  } else {
    line(tx, ty, tx + x, ty);
    origin.x = tx + x;
  }
  origin.y = ty;
  return [wx, wy, ix, iy];
}
