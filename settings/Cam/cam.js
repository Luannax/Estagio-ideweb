import * as faceapi from 'face-api.js';
import * as navigator from 'navigator';

function getFullUsername() {
    return navigator.userAgent;
}

async function initializeFaceAPI() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');
}

async function startVideo() {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;

    video.addEventListener('play', () => {
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);

        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceExpressions();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

            canvas.getContext('2d').font = '20px Arial';
            canvas.getContext('2d').fillStyle = 'red';
            canvas.getContext('2d').fillText(`Usuario: ${getFullUsername()}`, 10, 30);
        }, 100);
    });
}

initializeFaceAPI().then(startVideo);
