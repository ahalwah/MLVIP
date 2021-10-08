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

let state = 'waiting'
let showGraph = false;
let values = []

let cwidth = 680
let cheight = 480
let startTime = 0
let currentTime = 0
let waitTime = 0

const parts = [];
let mediaRecorder

async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
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
  createCanvas(cwidth, cheight);
  video = createCapture(VIDEO, videoReady);
  video.size(640, 480);
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
  drawTime=millis()
  background('black')
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
    // calculating angle
    if (state == 'collecting') {
      let wx = poses[0].keypoints[10].x; //right wrist
      let wy = poses[0].keypoints[10].y; //right wrist
      let ex = poses[0].keypoints[8].x; //right elbow
      let ey = poses[0].keypoints[8].y; //right elbow
      let sx = poses[0].keypoints[6].x; //right shoulders
      let sy = poses[0].keypoints[6].y; //right shoulders

      let a = dist(ex,ey,sx,sy) // length of arm (bicep)
      let b = dist(ex,ey,wx,wy) // length of forearm
      let c = dist(wx,wy,sx,sy)

      let angle = acos((a*a+b*b-c*c)/(2*a*b)) //angle value in radians
      currentTime=millis()
      values.push({x: parseInt(millis()), y: angle*180/PI})
    }
    //skeleton drawing
    stroke('green')
    for(let coord of positions){
      const {p1, p2} = coord
      if(poses[0].keypoints[p1].score > 0.5 && poses[0].keypoints[p2].score > 0.5)
        line(poses[0].keypoints[p1].x,poses[0].keypoints[p1].y,poses[0].keypoints[p2].x,poses[0].keypoints[p2].y)
    }
  }
  document.getElementById("btn").onclick = function() {
    waitTime=millis()
    console.log('Get in position to collect data')
    state='pause'
    showGraph=false
  }
  if(drawTime-waitTime<5000 && state=='pause'){
    fill('yellow')
    circle(660, 20, 30) 
  }
  if(state=='collecting'){
    fill('red')
    circle(660, 20, 30)
  }
  navigator.mediaDevices.getUserMedia({audio: false, video: true}).then(stream => {
    document.getElementById("defaultCanvas0").srcObject = stream;
    if(drawTime-waitTime>5000 && state=='pause'){
      console.log('collecting');
      state = 'collecting';
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start(1000);
      mediaRecorder.ondataavailable = function (e) {
        parts.push(e.data);
      }
      startTime=millis()
    }
  });

  if(state=='collecting' && currentTime-startTime>6000){
    state='waiting'
    showGraph=true
    mediaRecorder.stop();
    const blob = new Blob(parts, {
        type: "video/webm"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "video.webm"
    a.click();
    }

    if(showGraph==true){
      var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
          text: "Angle vs. Time"
        },
        data: [{        
          type: "line",
          indexLabelFontSize: 16,
          dataPoints: values,
        }]
      });
      chart.render()
      showGraph=false
      values=[]
    }

}
