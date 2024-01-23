let video = document.getElementById('video');
let canvas = document.body.appendChild(document.createElement("canvas"));
let ctx =canvas.getContext("2d");

let width = 1500;
let height = 800;

const startstream = () => {
    console.log(" - - - - START STREAM - - - - ");
    navigator.mediaDevices.getUserMedia({
        video : (width, height),
        audio : false
    }).then((stream) => {video.srcObject = stream});
}

console.log(faceapi.nets);

console.log(" - - - - START LOAD MODEL - - - - ");
Promise.all([
    faceapi.nets.ageGenderNet.loadFromUri('models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('models'),
    faceapi.nets.faceExpressionNet.loadFromUri('models'),
]).then(startstream);


async function detect() {
    const detections = await faceapi.detectAllFaces(video)
                                .withFaceLandmarks()
                                .withFaceExpressions()
                                .withAgeAndGender();
    console.log(detections);

    ctx.clearRect(0, 0, width, height);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections); // Corrected method name
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections); // Corrected method name
}


video.addEventListener('play', () => {
    displaySize = {width, height};
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(detect, 100)
})