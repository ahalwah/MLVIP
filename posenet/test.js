const recordBtn = document.getElementById("btn");

let recording = false;
let mediaRecorder;
let recordedChunks;

let canvas
let started = false;
function setup(){
    createCanvas(640,480)
    video = createCapture(VIDEO);
    video.size(640,480)
    video.hide();
}
function draw(){
    image(video, 0, 0, 640, 480);
    circle(200, 200, 40)
    circle(200, 300, 50)
    if(started)
        console.log('running')
}

recordBtn.addEventListener("click", () => {
    recording = !recording;
      if(recording){
              recordBtn.textContent = "Stop";
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
              started = true
              mediaRecorder.start();
              console.log('recording')
          } else {
              recordBtn.textContent = "Record"
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
  });