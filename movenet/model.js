let detector;
let poses;
let video;
let positions=[
  {p1:0,p2:1},
  {p1:0,p2:2},
  {p1:1,p2:3},
  {p1:2,p2:4},
  {p1:6,p2:5},
  {p1:6,p2:8},
  {p1:8,p2:10},
  {p1:5,p2:7},
  {p1:7,p2:9},
  {p1:6,p2:12},
  {p1:5,p2:11},
  {p1:12,p2:11},
  {p1:12,p2:14},
  {p1:14,p2:16},
  {p1:11,p2:13},
  {p1:13,p2:15},
]

async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.PoseNet,
    detectorConfig
  );
}

async function videoReady() {
  console.log("video ready");
  await getPoses();
}

async function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, videoReady);
  // video.size(320, 240);
  video.hide();
  await init();

  // createButton('pose').mousePressed(getPoses);
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
    for (let kp of poses[0].keypoints) {
      const { x, y, score } = kp;
      if (score > 0.5) {
        fill(255);
        stroke(0);
        strokeWeight(4);
        circle(x, y, 16); 
      }
    }
    //skeleton drawing
    stroke('green')
    for(let coord of positions){
      const {p1, p2} = coord
      if(poses[0].keypoints[p1].score > 0.5 && poses[0].keypoints[p2].score > 0.5)
        line(poses[0].keypoints[p1].x,poses[0].keypoints[p1].y,poses[0].keypoints[p2].x,poses[0].keypoints[p2].y)
    }
    
  }
}