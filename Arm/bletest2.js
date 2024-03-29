const serviceUuid = "0000ffe0-0000-1000-8000-00805f9b34fb";
let myCharacteristic;
let myValue = 0;
let myBLE;
let isConnected = false;

function setup() {
  // Create a p5ble class
  myBLE = new p5ble();

  createCanvas(200, 200);
  textSize(20);
  textAlign(CENTER, CENTER);

  // Create a 'Connect and Start Notifications' button
  const connectButton = createButton("Connect and Start Notifications");
  connectButton.mousePressed(connectAndStartNotify);

  // Create a 'Stop Notifications' button
  const stopButton = createButton("Stop Notifications");
  stopButton.mousePressed(stopNotifications);
}

function connectAndStartNotify() {
  // Connect to a device by passing the service UUID
  myBLE.connect(serviceUuid, gotCharacteristics);
}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
  if (error) console.log("error: ", error);
  console.log("characteristics: ", characteristics);
  myCharacteristic = characteristics[0];
  isConnected = myBLE.isConnected();
  // Start notifications on the first characteristic by passing the characteristic
  // And a callback function to handle notifications
  myBLE.startNotifications(myCharacteristic, handleNotifications);
  // You can also pass in the dataType
  // Options: 'unit8', 'uint16', 'uint32', 'int8', 'int16', 'int32', 'float32', 'float64', 'string'
  // myBLE.startNotifications(myCharacteristic, handleNotifications, 'string');
}

// A function that will be called once got characteristics
function handleNotifications(data) {
  console.log("data: ", data);
  myValue = data;
}

// A function to stop notifications
function stopNotifications() {
  myBLE.stopNotifications(myCharacteristic);
}

function writeToBle(command) {
  const inputValue = command;
  // Write the value of the input to the myCharacteristic
  myBLE.write(myCharacteristic, inputValue);
}

function draw() {
  if (isConnected) writeToBle("2");
  background(250);
  // Write value on the canvas
  text(myValue, 100, 100);
}
