let model;

function setup() {
  createCanvas(640, 480);
  let options = {
    inputs: ["x", "y"],
    outputs: ["phi"],
    task: "regression",
    debug: true,
  };
  model = ml5.neuralNetwork(options);
  model.loadData("data.json", dataReady);
}

function dataReady() {
  model.normalizeData();
  model.train({ epochs: 200 }, finished);
}

function finished() {
  model.log("model trained");
  model.save();
}
