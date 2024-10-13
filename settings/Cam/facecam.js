const synth = window.speechSynthesis;

function falar(texto) {
    const utterThis = new SpeechSynthesisUtterance(texto);
    synth.speak(utterThis);
}

function getFullUsername() {
    return "Usuário Simulado";
}

let video = document.createElement('video');
let canvas = document.createElement('canvas');
let context = canvas.getContext('2d');
let nomeUsuario = getFullUsername();
let contadorFrames = 0;

const rectSize = 200;
let x1, y1, x2, y2;

async function detectarRosto() {
    document.body.appendChild(video);
    document.body.appendChild(canvas);

    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
    video.play();

    video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        x1 = (canvas.width - rectSize) / 2;
        y1 = (canvas.height - rectSize) / 2;
        x2 = x1 + rectSize;
        y2 = y1 + rectSize;

        processarVideo();
    };
}

async function processarVideo() {
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = 'blue';
        context.lineWidth = 2;
        context.strokeRect(x1, y1, rectSize, rectSize);

        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());

        if (detections.length > 0) {
            detections.forEach(detection => {
                const box = detection.box;
                context.strokeStyle = 'green';
                context.lineWidth = 2;
                context.strokeRect(box.x, box.y, box.width, box.height);

                if (contadorFrames % 10 === 0) {
                    if (box.x < x1) {
                        falar("Vire seu rosto para a direita.");
                    } else if (box.x + box.width > x2) {
                        falar("Vire seu rosto para a esquerda.");
                    } else if (box.y < y1) {
                        falar("Levante seu rosto.");
                    } else if (box.y + box.height > y2) {
                        falar("Abaixe seu rosto.");
                    } else {
                        falar("Rosto centralizado.");
                    }
                }
            });
        }

        context.font = "20px Arial";
        context.fillStyle = "red";
        context.fillText(`Usuário: ${nomeUsuario}`, 10, 30);

        contadorFrames++;
    }, 50);
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
]).then(detectarRosto);
