let width = 640,
  height = 480;
let xorigin = width / 2,
  yorigin = height / 2;
let l1 = 100,
  l2 = 100;
let thetas, config;
let xpos, ypos;
let detector;
let poses;
let video;
let p1;

const serviceUuid = "0000ffe0-0000-1000-8000-00805f9b34fb";
let myCharacteristic;
let myBLE;
let isConnected = false;
let counter = 0;

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
  createCanvas(width * 2, height);

  // Create a p5ble class
  console.log("setting up");
  myBLE = new p5ble();

  const connectButton = createButton("Connect");
  connectButton.mousePressed(connectToBle);
  connectButton.position(15, 15);

  p1 = createGraphics(width, height, WEBGL);
  video = createCapture(VIDEO, videoReady);
  video.hide();
  await init();
}

async function getPoses() {
  poses = await detector.estimatePoses(video.elt);
  setTimeout(getPoses, 0);
}

function draw() {
  p1.clear();
  p1.background("grey");
  p1.line(-width / 2, 0, 0, width / 2, 0, 0);
  p1.line(0, -height / 2, 0, 0, height / 2, 0);
  image(video, 0, 0);
  if (poses && poses.length > 0) {
    if (poses[0].keypoints[16].score > 0.9) {
      x = poses[0].keypoints[16].x;
      y = poses[0].keypoints[16].y;
      fill("yellow");
      circle(x, y, 40);
      xpos = x - xorigin;
      ypos = yorigin - y;
      xpos = xpos.map(0, width / 2, 0, l1 + l2) * -1;
      ypos = ypos.map(0, height / 2, 0, l1 + l2) * -1;
    }
    thetas = inverse2R(l1, l2, xpos, ypos);
    let a1, a2; //angles
    if (thetas != "unreachable") {
      a1 = thetas[2];
      a2 = thetas[3];
      // send angles over bluetooth

      if (isConnected && counter % 10 == 0 && ypos < 0) {
        if (counter == 100) counter = 0;
        let ang1 = parseInt(a1).toString();
        let ang2 = parseInt(a2).toString();
        //don't send if a1 is below horizontal
        if (ang1 < 0) writeToBle("@" + abs(ang1) + "#" + abs(ang2) + "!");
      } else if (counter % 10 == 0 && ypos < 0) {
        if (counter == 100) counter = 0;
        console.log(parseInt(a1) + " " + parseInt(a2));
      }

      config = forward2R(l1, l2, a1, a2);
    } else {
      console.log(thetas);
    }
    p1.fill("red");
    p1.circle(config[2], config[3], 10);

    p1.fill("black");
    p1.line(0, 0, config[0], config[1]);
    p1.line(config[0], config[1], config[2], config[3]);
  }
  image(p1, 640, 0);
  counter = counter + 1;
}
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

function inverse2R(l1, l2, x, y) {
  angleMode(DEGREES);
  if (abs(x ** 2 + y ** 2 - l1 ** 2 - l2 ** 2) / (2 * l1 * l2) > 1) {
    return "unreachable";
  } else {
    cos2 = (x ** 2 + y ** 2 - l1 ** 2 - l2 ** 2) / (2 * l1 * l2);
    sin2 = sqrt(1 - cos2 ** 2);
    msin2 = -sin2;
    theta2 = atan2(sin2, cos2);
    if (sin2 == 0) {
      return "singular";
    } else {
      mtheta2 = atan2(msin2, cos2);
      theta1 = atan2(y, x) - atan2(l2 * sin2, l1 + l2 * cos2);
      mtheta1 = atan2(y, x) - atan2(l2 * msin2, l1 + l2 * cos2);
      return [theta1, theta2, mtheta1, mtheta2];
    }
  }
}

function forward2R(l1, l2, theta1, theta2) {
  angleMode(DEGREES);
  x1 = l1 * cos(theta1);
  y1 = l1 * sin(theta1);
  x = x1 + l2 * cos(theta1 + theta2);
  y = y1 + l2 * sin(theta1 + theta2);
  return [x1, y1, x, y];
}

function connectToBle() {
  // Connect to a device by passing the service UUID
  myBLE.connect(serviceUuid, gotCharacteristics);
}

function gotCharacteristics(error, characteristics) {
  if (error) console.log("error: ", error);
  console.log("characteristics: ", characteristics);
  // Set the first characteristic as myCharacteristic
  myCharacteristic = characteristics[0];
  isConnected = myBLE.isConnected();
}

function writeToBle(command) {
  const inputValue = command.toString();
  // Write the value of the input to the myCharacteristic
  myBLE.write(myCharacteristic, inputValue);
}
