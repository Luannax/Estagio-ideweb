<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Face Detection</title>
    <style>
        canvas {
            position: absolute;
            top: 0;
            left: 0;
        }
    </style>
</head>
<body>
    <video id="webcam" autoplay></video>
    <canvas id="canvas"></canvas>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface"></script>

    <script>
        // Função para sintetizar fala
        function falar(texto) {
            const synth = window.speechSynthesis;
            const utterThis = new SpeechSynthesisUtterance(texto);
            synth.speak(utterThis);
        }

        // Obtendo o nome completo do usuário
        async function getFullUsername() {
            let username = "Usuário";
            if (navigator.platform.startsWith("Win")) {
                username = await fetch("https://api.userinfo.io/userinfos").then(res => res.json()).then(data => data.name || "Usuário");
            }
            return username;
        }

        // Inicializando a webcam
        const video = document.getElementById('webcam');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            video.srcObject = stream;
        });

        const rectSize = 200;

        let model;

        // Carregar modelo de reconhecimento de rosto
        async function loadModel() {
            model = await blazeface.load();
            detectFaces();
        }

        async function detectFaces() {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const faces = await model.estimateFaces(video, false);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const x1 = (canvas.width - rectSize) / 2;
            const y1 = (canvas.height - rectSize) / 2;
            const x2 = x1 + rectSize;
            const y2 = y1 + rectSize;

            // Desenha o retângulo central
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.strokeRect(x1, y1, rectSize, rectSize);

            if (faces.length > 0) {
                faces.forEach(face => {
                    const topLeft = face.topLeft;
                    const bottomRight = face.bottomRight;

                    const [xMin, yMin] = topLeft;
                    const [xMax, yMax] = bottomRight;

                    // Desenha o rosto detectado
                    ctx.strokeStyle = 'green';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(xMin, yMin, xMax - xMin, yMax - yMin);

                    // Direções para centralizar o rosto
                    if (xMin < x1) {
                        falar("Vire seu rosto para a direita.");
                    } else if (xMax > x2) {
                        falar("Vire seu rosto para a esquerda.");
                    } else if (yMin < y1) {
                        falar("Levante seu rosto.");
                    } else if (yMax > y2) {
                        falar("Abaixe seu rosto.");
                    } else {
                        falar("Rosto centralizado.");
                    }
                });
            }

            // Atualiza e desenha o nome do usuário
            const nomeUsuario = await getFullUsername();
            ctx.font = "20px Arial";
            ctx.fillStyle = "red";
            ctx.fillText(`Usuário: ${nomeUsuario}`, 10, 30);

            requestAnimationFrame(detectFaces);
        }

        loadModel();
    </script>
</body>
</html>
