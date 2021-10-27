//max x**2+y**2=300**2=90000
let angle1 = 0,
  angle2 = 0,
  angle3 = 0;
let pangle1 = 0, // previous angles
  pangle2 = 0,
  pangle3 = 0;
let alpha = 0, // base angle of rotation
  palpha = 0;
let x = 150,
  y = 10,
  phi = 0;

let a1 = 100,
  a2 = 100,
  a3 = 100;

let video;
let poseNet;
let pose;
let skeleton;

let counter = 0;
let ydown = 100; //positive because downward is +y
let xright = 650 / 2; //positive because right is +x
let p1;

function setup() {
  createCanvas(1300, 650);
  p1 = createGraphics(650, 650, WEBGL);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);
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
  background("grey");
  //p1.background(220);
  image(video, 0, 0); //-650 -240
  if (true) {
    //pose
    //left hip =12, right hip = 11, right wrist = 10, left wrist= 9
    /*
    let pos = centerCoordinates(pose.rightWrist.x,pose.rightWrist.y,
                                pose.rightHip.x,pose.rightHip.y,
                                pose.leftHip.x,pose.leftHip.y)
    //console.log(pose.rightWrist.confidence+' '+pose.rightHip.confidence+' '+pose.leftHip.confidence)
    
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0,255,0);
      ellipse(x+650,y,16,16);
    }
    
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(220);
      line(a.position.x+650, a.position.y,b.position.x+650,b.position.y);      
    }
    */
    if (true) {
      //pose.rightWrist.confidence>0.5 && pose.rightHip.confidence>0.5 && pose.leftHip.confidence>0.5
      //console.log(pose.rightWrist.x+' '+pose.rightWrist.y)
      if (true) {
        //pose.rightWrist.x**2+pose.rightWrist.y**2<=90000

        //fill('red');
        //ellipse(pose.rightWrist.x+650,pose.rightWrist.y,25,25);

        let angles = "unreachable";
        if (counter % 5 == 0) {
          while (angles == "unreachable") {
            phi = random(-60, 241);
            angles = inverse(a1, a2, a3, 200, 150, (PI / 180) * phi);
            //console.log(phi+' '+angles)
          }
          angle1 = (180 / PI) * angles.sol1.theta1;
          angle2 = (180 / PI) * angles.sol1.theta2;
          angle3 = (180 / PI) * angles.sol1.theta3;
          pangle1 = angle1;
          pangle2 = angle2;
          pangle3 = angle3;
          console.log(
            counter +
              ": " +
              parseInt(angle1) +
              " " +
              parseInt(angle2) +
              " " +
              parseInt(angle3)
          );
          drawBase();
          drawLink1(
            (PI / 180) * alpha,
            (PI / 180) * (90 - angle1),
            (PI / 180) * angle1
          );
          drawLink2(
            (PI / 180) * alpha,
            (PI / 180) * (90 - angle1 - angle2),
            (PI / 180) * angle1,
            (PI / 180) * angle2
          );
          drawLink3(
            (PI / 180) * alpha,
            (PI / 180) * (90 - angle1 - angle2 - angle3),
            (PI / 180) * angle1,
            (PI / 180) * angle2,
            (PI / 180) * angle3
          );
        } else {
          console.log(
            counter +
              ": " +
              parseInt(pangle1) +
              " " +
              parseInt(pangle2) +
              " " +
              parseInt(pangle3)
          );
          drawBase();
          drawLink1(
            (PI / 180) * palpha,
            (PI / 180) * (90 - pangle1),
            (PI / 180) * pangle1
          );
          drawLink2(
            (PI / 180) * palpha,
            (PI / 180) * (90 - pangle1 - pangle2),
            (PI / 180) * pangle1,
            (PI / 180) * pangle2
          );
          drawLink3(
            (PI / 180) * palpha,
            (PI / 180) * (90 - pangle1 - pangle2 - pangle3),
            (PI / 180) * pangle1,
            (PI / 180) * pangle2,
            (PI / 180) * pangle3
          );
        }

        /*
        if(mouseIsPressed)
          console.log('('+abs(325-mouseX)+','+abs(325-mouseY)+')')
        */
      }
    }
  }
  image(p1, 650, 0);
  //image(video, 650, 0);
  counter += 1;
}

//wrist x, wrist y, left hip x, left hip y, right hip x, right hip y
function centerCoordinates(x, y, x1, y1, x2, y2) {
  let center = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
  return { x: abs(x - center.x), y: abs(y - center.y) };
}

function drawBase() {
  p1.push();
  p1.fill("black");
  //translate(xright, ydown);
  p1.cylinder(20, 20);
  p1.pop();
}
function drawLink1(alpha, theta, a) {
  let h = 50 * cos(a);
  p1.push();
  p1.fill("blue");
  //translate(xright, ydown);
  p1.rotateY(alpha);
  p1.translate(cos(a) * 50, -50 - 10 + 50 - sin(a) * 50, 0);
  p1.rotateZ(theta);

  p1.ellipsoid(15, 50, 15);
  p1.pop();
}
function drawLink2(alpha, theta, a1, a2) {
  let h = 50 * cos(a1 + a2);
  p1.push();
  p1.fill("white");
  //translate(xright, ydown);
  //forward kinematics
  p1.rotateY(alpha);
  p1.translate(100 * cos(a1), -10 - 100 * sin(a1) - 50, 0);
  p1.translate(cos(a1 + a2) * 50, 50 - sin(a1 + a2) * 50, 0);
  p1.rotateZ(theta);
  p1.ellipsoid(15, 50, 15);
  p1.pop();
}
function drawLink3(alpha, theta, a1, a2, a3) {
  let h = 50 * cos(a1 + a2 + a3);
  p1.push();
  p1.fill("red");
  //translate(xright, ydown);
  //forward kinematics
  p1.rotateY(alpha);
  p1.translate(
    100 * cos(a1) + 100 * cos(a1 + a2),
    -10 - 100 * sin(a1) - 100 * sin(a1 + a2) - 50,
    0
  );
  p1.translate(cos(a1 + a2 + a3) * 50, 50 - sin(a1 + a2 + a3) * 50, 0);
  p1.rotateZ(theta);
  p1.ellipsoid(15, 50, 15);
  p1.pop();
}

function forward(a1, a2, a3, theta1, theta2, theta3) {
  var c1 = cos(theta1);
  var c12 = cos(theta1 + theta2);
  var c123 = cos(theta1 + theta2 + theta3);
  var s1 = sin(theta1);
  var s12 = sin(theta1 + theta2);
  var s123 = sin(theta1 + theta2 + theta3);
  var X = a1 * c1 + a2 * c12 + a3 * c123;
  var Y = a1 * s1 + a2 * s12 + a3 * s123;
  var phi = theta1 + theta2 + theta3;

  return { x: X, y: Y, phi: phi };
}

function inverse(a1, a2, a3, x, y, phi) {
  //https://www.youtube.com/watch?v=AQW0ITpOeBw
  var wx = x - a3 * cos(phi);
  var wy = y - a3 * sin(phi);

  var c2 = (wx ** 2 + wy ** 2 - a1 ** 2 - a2 ** 2) / (2 * a1 * a2); // c2<=1 -> valid sol
  if (c2 > 1) return "unreachable";
  var s2 = [sqrt(1 - c2 ** 2), -sqrt(1 - c2 ** 2)];
  var theta21 = atan2(s2[0], c2);
  var theta22 = atan2(s2[1], c2);

  var s11 =
    (wy * (a1 + a2 * cos(theta21)) - a2 * sin(theta21) * wx) /
    (a1 ** 2 + a2 ** 2 + 2 * a1 * a2 * cos(theta21));
  var s12 =
    (wy * (a1 + a2 * cos(theta22)) - a2 * sin(theta22) * wx) /
    (a1 ** 2 + a2 ** 2 + 2 * a1 * a2 * cos(theta22));
  var c11 =
    (wx * (a1 + a2 * cos(theta21)) + a2 * sin(theta21) * wy) /
    (a1 ** 2 + a2 ** 2 + 2 * a1 * a2 * cos(theta21));
  var c12 =
    (wx * (a1 + a2 * cos(theta22)) + a2 * sin(theta22) * wy) /
    (a1 ** 2 + a2 ** 2 + 2 * a1 * a2 * cos(theta22));
  var theta11 = atan2(s11, c11);
  var theta12 = atan2(s12, c12);

  var theta31 = phi - theta11 - theta21;
  var theta32 = phi - theta12 - theta22;

  return {
    sol1: { theta1: theta11, theta2: theta21, theta3: theta31 },
    sol2: { theta1: theta12, theta2: theta22, theta3: theta32 },
  };
}
