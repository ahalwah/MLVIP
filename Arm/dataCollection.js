let model;
let firstRun = true;

function setup() {
  createCanvas(400, 400);
  let options = {
    inputs: ["x", "y"],
    outputs: ["phi"],
    task: "regression",
    debug: true,
  };
  model = ml5.neuralNetwork(options);
}

function draw() {
  background(220);
  if (firstRun) {
    collectData();
    model.saveData(); //save data
    firstRun = false;
  }
}

function collectData() {
  console.log("start");
  for (let a1 = 0; a1 <= 180; a1 += 1) {
    for (let a2 = 0; a2 <= 10; a2 += 1) {
      for (let a3 = 0; a3 <= 10; a3 += 1) {
        let pos = forward(
          100,
          100,
          100,
          (PI / 180) * a1,
          (PI / 180) * a2,
          (PI / 180) * a3
        );
        let inputs = { x: pos.x, y: pos.y };
        let target = { phi: pos.phi };
        model.addData(inputs, target);
      }
    }
  }
  console.log("done");
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
