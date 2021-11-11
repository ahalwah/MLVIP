let video;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel = "";
let prevLabel = "";

const serviceUuid = "0000ffe0-0000-1000-8000-00805f9b34fb";
let blueToothCharacteristic;
let receivedValue = "";

let blueTooth;
let isConnected = false;

var millisecondTimerStart;
var oldColorPickerValue;

function setup() {
  createCanvas(640, 480);
  // Create a p5ble class
  console.log("setting up");
  blueTooth = new p5ble();

  const connectButton = createButton("Connect");
  connectButton.mousePressed(connectToBle);
  connectButton.position(15, 15);
  millisecondTimerStart = millis();

  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);

  let opt = {
    inputs: 34,
    outputs: 5,
    task: "classification",
    debug: true,
  };
  brain = ml5.neuralNetwork(opt);
  const modelInfo = {
    model: "model/model.json",
    metadata: "model/model_meta.json",
    weights: "model/model.weights.bin",
  };
  brain.load(modelInfo, brainLoaded);
}

function brainLoaded() {
  console.log("pose classification ready!");
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
  }
  //console.log(results[0].confidence);
  classifyPose();
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log("poseNet ready");
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  drawScreen();

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }

  pop();
  fill(255, 0, 255);
  noStroke();
  textSize(100);
  text(poseLabel, 560, 80);
  if (poseLabel != "" && isConnected && poseLabel!=prevLabel) {
    sendData(poseLabel);
  }
  prevLabel = poseLabel;
}

function connectToBle() {
  // Connect to a device by passing the service UUID
  blueTooth.connect(serviceUuid, gotCharacteristics);
}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
  if (error) {
    console.log("error: ", error);
  }
  blueToothCharacteristic = characteristics[0];

  blueTooth.startNotifications(blueToothCharacteristic, gotValue, "string");

  isConnected = blueTooth.isConnected();
  // Add a event handler when the device is disconnected
  blueTooth.onDisconnected(onDisconnected);
}

// A function that will be called once got values
function gotValue(value) {
  console.log("value: ", value);
}

function onDisconnected() {
  console.log("Device got disconnected.");
  isConnected = false;
}

function sendData(command) {
  const inputValue = command;
  if (!("TextEncoder" in window)) {
    console.log("Sorry, this browser does not support TextEncoder...");
  }
  var enc = new TextEncoder(); // always utf-8
  blueToothCharacteristic.writeValue(enc.encode(inputValue));
}

function drawScreen() {
  if (isConnected) {
    fill(0, 255, 0);
    ellipse(120, 25, 30, 30);
  } else {
    fill(255, 0, 0);
    ellipse(120, 25, 30, 30);
  }
}
