let state = 'waiting';

let showGraph = false;
let values =[]

let cwidth = 680
let cheight = 480
let startTime = 0
let currentTime = 0
let waitTime = 0

let video;
let poseNet;
let pose;
let skeleton;

//const parts = [];
const recordBtn = document.getElementById("btn");
let recording = false;
let mediaRecorder;
let recordedChunks;
let canvas;
let started = false;
let oneRun = false;

function setup() {
  canvas = createCanvas(cwidth, cheight);

  video = createCapture(VIDEO);
  video.size(640,480)
  video.hide();

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  //console.log(poses); 
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if (state == 'collecting') {
      let w = pose.keypoints[10].position; //right wrist
      let e = pose.keypoints[8].position; //right elbow
      let s = pose.keypoints[6].position; //right shoulders

      let a = dist(e.x,e.y,s.x,s.y) // length of arm (bicep)
      let b = dist(e.x,e.y,w.x,w.y) // length of forearm
      let c = dist(w.x,w.y,s.x,s.y)

      let angle = acos((a*a+b*b-c*c)/(2*a*b)) //angle value in radians
      //console.log(angle*180/PI) //print angle value in degrees
      currentTime=millis()
      values.push({x: parseInt(millis()), y: angle*180/PI})
    }
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  drawTime=millis()
  background('black')
  image(video, 0, 0, 640, 480);

  if (pose) {
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0,255,0);
      ellipse(x,y,16,16);
    }
    
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y,b.position.x,b.position.y);      
    } 
  }

if(started){
  if(drawTime-waitTime<5000 && state=='pause'){
    fill('yellow')
    circle(660, 20, 30) 
  }
  if(state=='collecting'){
    fill('red')
    circle(660, 20, 30)
  }

  if(drawTime-waitTime>5000 && state=='pause'){
    console.log('collecting');
    state = 'collecting';
    startTime=millis()
    if(oneRun){
      const stream = document.getElementById("defaultCanvas0").captureStream(25);
      mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9'
      });
      recordedChunks = [];
      mediaRecorder.ondataavailable = e => {
          if(e.data.size > 0){
              recordedChunks.push(e.data);
              console.log('appending')
          }
      };
      mediaRecorder.start();
      console.log('recording')
      oneRun=!oneRun
    }
  }

  if(state=='collecting' && currentTime-startTime>6000){
    state='waiting'
    showGraph=true
    started=false
    mediaRecorder.stop();
    setTimeout(() => {
        const blob = new Blob(recordedChunks, {
            type: "video/webm"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "recording.webm";
        a.click();
        URL.revokeObjectURL(url);
    },0);
  }
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

recordBtn.addEventListener("click", () => {
  //once the button is pressed
  waitTime=millis()
  console.log('Get in position to collect data')
  state='pause'
  showGraph=false
  started = true
  oneRun = true

});