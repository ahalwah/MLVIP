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

const parts = [];
let mediaRecorder

function setup() {
  createCanvas(cwidth, cheight);

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