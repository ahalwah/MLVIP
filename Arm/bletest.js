const serviceUuid = "0000ffe0-0000-1000-8000-00805f9b34fb";
let myCharacteristic;
let input;
let myBLE;

function setup() {
  myBLE = new p5ble();

  // Create a 'Connect' button
  const connectButton = createButton("Connect");
  connectButton.mousePressed(connectToBle);
  connectButton.position(15, 65);

  // Create a text input
  input = createInput();
  input.position(15, 100);

  // Create a 'Write' button
  const writeButton = createButton("Write");
  writeButton.position(input.x + input.width + 15, 100);
  writeButton.mousePressed(writeToBle);
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
}

function writeToBle() {
  const inputValue = input.value();
  // Write the value of the input to the myCharacteristic
  myBLE.write(myCharacteristic, inputValue);
}
