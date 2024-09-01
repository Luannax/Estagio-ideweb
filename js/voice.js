document.getElementById('chamarbtnUserVoz').addEventListener('click', function () {
    // Obter o botão pelo ID
    var btnUserVoz = document.getElementById('chamarbtnUserVoz');

    // Verificar se o botão existe
    if (btnUserVoz) {
        // clique no botão
        btnUserVoz.click();
    } else {
        console.log("O botão 'chamarbtnUserVoz' não foi encontrado.");
    }

    // Verifica se o navegador suporta a API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configurações da API
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Elementos da página
    const startbtnUserVoz = document.getElementById('start-btn');
    const result = document.getElementById('result');

    // Inicia o reconhecimento de fala ao clicar no botão
    startbtnUserVoz.addEventListener('click', () => {
        recognition.start();
    });

    // Exibe o resultado da fala e altera o tema com base no comando
    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.toLowerCase().trim();
        result.textContent = `Você disse: ${speechResult}`;

        if (speechResult === "claro") {
            document.body.classList.remove('dark-theme');
            console.log("Tema alterado para: claro");
        } else if (speechResult === "escuro") {
            document.body.classList.add('dark-theme');
            console.log("Tema alterado para: escuro");
        } else {
            console.log("Comando não reconhecido para tema.");
        }
    }

    // Para o reconhecimento de fala quando a fala termina
    recognition.onspeechend = () => {
        recognition.stop();
    }

    // Lida com erros
    recognition.onerror = (event) => {
        result.textContent = `Erro no reconhecimento de fala: ${event.error}`;
    }
})
