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
  phi = 0,
  pphi = phi;
let firstIter = true; // first time phi is calculated
let a1 = 100,
  a2 = 100,
  a3 = 100;

let video;
let poseNet;
let pose;
let skeleton;

let ydown = 100; //positive because downward is +y
let xright = 650 / 2; //positive because right is +x
let p1;
let pposition = { x: 0, y: 0 };

function setup() {
  createCanvas(1290, 650);
  background("white");
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
  p1.clear();
  p1.background("grey");
  image(video, 0, 0); //-650 -240
  line(0, 240, 640, 240);
  if (pose) {
    //left hip =12, right hip = 11, right wrist = 10, left wrist= 9
    if (pose.rightWrist.confidence > 0.5) {
      fill("yellow");
      if (pose.rightWrist.y <= 480 - 30 / 2)
        circle(pose.rightWrist.x, pose.rightWrist.y, 30);
      let position = centerAboutOrigin(
        pose.rightWrist.x,
        pose.rightWrist.y,
        320,
        240
      );
      if (
        position.x ** 2 + position.y ** 2 <= 300 ** 2 &&
        pose.rightWrist.y < 240
      ) {
        fill("green");
        circle(pose.rightWrist.x, pose.rightWrist.y, 30);
        //console.log(position.x + " " + position.y);

        let angles = "unreachable";
        if (
          dist(position.x, position.y, pposition.x, pposition.y) >= 10 &&
          position.y >= -10
        ) {
          let c = 0; // while loop counter
          while (angles == "unreachable") {
            if (c > 500) break;
            phi = random(-60, 241);
            angles = inverse(
              a1,
              a2,
              a3,
              position.x,
              position.y,
              (PI / 180) * phi
            );
            if (firstIter == false)
              if (abs(phi - pphi) <= 30 && angles != "unreachable") break;

            c = c + 1;
          }
          //console.log(phi + " " + pphi);
          /*
          let wx = pose.keypoints[10].position.x; //right wrist
          let wy = pose.keypoints[10].position.y; //right wrist
          let ex = pose.keypoints[8].position.x; //right elbow
          let ey = pose.keypoints[8].position.y; //right elbow
          let sx = pose.keypoints[6].position.x; //right shoulders
          let sy = pose.keypoints[6].position.y; //right shoulders

          let a = dist(ex, ey, sx, sy); // length of arm (bicep)
          let b = dist(ex, ey, wx, wy); // length of forearm
          let c = dist(wx, wy, sx, sy);

          let angle = acos((a * a + b * b - c * c) / (2 * a * b)); //phi value in radians
          console.log(angle);
          angles = inverse(a1, a2, a3, position.x, position.y, angle);
          */
          if (angles != "unreachable") {
            angle1 = (180 / PI) * angles.sol1.theta1;
            angle2 = (180 / PI) * angles.sol1.theta2;
            angle3 = (180 / PI) * angles.sol1.theta3;
            pangle1 = angle1;
            pangle2 = angle2;
            pangle3 = angle3;

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
          }
        } else {
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
        pposition.x = position.x;
        pposition.y = position.y;
      } else {
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
    }
  }
  pphi = phi;
  firstIter = false;
  image(p1, 640, 0);
}

//wrist x, wrist y, left hip x, left hip y, right hip x, right hip y
function centerCoordinates(x, y, x1, y1, x2, y2) {
  let center = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
  return { x: abs(x - center.x), y: abs(y - center.y) };
}

function centerAboutOrigin(x, y, xorigin, yorigin) {
  return { x: x - xorigin, y: yorigin - y };
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
