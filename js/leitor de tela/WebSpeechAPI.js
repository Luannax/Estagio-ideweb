// Função para configurar os parâmetros da fala
function configureUtterance(speech) {
    speech.lang = 'pt-BR'; // Define o idioma para Português
    speech.rate = 1; // Velocidade da fala
    speech.pitch = 1; // Tom da fala
    speech.volume = 1; // Volume da fala
}

// Função para iniciar a leitura
function Iniciar_Leitura(speech) {
    window.speechSynthesis.speak(speech); // Inicia a síntese de fala com o objeto speech
}

// Função para ler o elemento focado (exceto o campo de código)
function Ler_Elementos() {
    if (window.speechSynthesis.speaking) { // Verifica se já está falando
        window.speechSynthesis.cancel(); // Cancela a fala atual
    }

    const ElementoFocado = document.activeElement; // Obtém o elemento atualmente focado
    const speech = new SpeechSynthesisUtterance(); // Cria um novo objeto de síntese de fala

    // Verifica se o elemento focado é o campo de código; se for, pega diretamente o que está no editor e passa para o speech.text 
    if (ElementoFocado.id === 'code') {
        let codeEditor = ace.edit("code", {
            mode: "ace/mode/python",
            selectionStyle: "text"
        })
        speech.text = codeEditor.getValue();
    }else if (ElementoFocado.tagName === 'A') { // Se o elemento focado for um link
        const img = ElementoFocado.querySelector('img'); // Procura uma imagem dentro do link
        speech.text = img && img.alt ? "Ícone: " + img.alt : "Link: " + ElementoFocado.textContent; // Define o texto da fala
    } else if (ElementoFocado.tagName === 'BUTTON') { // Se o elemento focado for um botão
        speech.text = ElementoFocado.getAttribute('aria-label') || "Botão: " + ElementoFocado.textContent; // Define o texto da fala
    } else if (ElementoFocado.tagName === 'SELECT') { // Se o elemento focado for um select
        const selectedOption = ElementoFocado.options[ElementoFocado.selectedIndex]; // Obtém a opção selecionada
        speech.text = ElementoFocado.getAttribute('aria-label') + ", opção selecionada: " + selectedOption.text; // Define o texto da fala
    } else if (ElementoFocado.classList.contains('container-btn-toggle')) { // Se o elemento focado for um botão de alternância
        const switchElement = ElementoFocado.querySelector('#switch'); // Procura o switch dentro do botão
        speech.text = switchElement.checked ? "Tema escuro ativado" : "Tema claro ativado"; // Define o texto da fala
    } else {
        speech.text = ElementoFocado.textContent; // Define o texto da fala para o conteúdo do elemento focado
    }

    console.log(`Lendo: ${speech.text}`); // mostra o texto que será lido no console do navegador
    configureUtterance(speech); // Configura os parâmetros da fala
    Iniciar_Leitura(speech); // Inicia a leitura
}

// Função para ler uma mensagem ao entrar no campo de código
function Ler_CampoCodigoFocado() {
    console.log("Focado no campo de código"); // mostra o texto que será lido no console do navegador
    const speech = new SpeechSynthesisUtterance("Você está no campo de entrada para digitar o código."); // Cria um objeto de síntese de fala com a mensagem
    configureUtterance(speech); // Configura os parâmetros da fala
    Iniciar_Leitura(speech); // Inicia a leitura
}

// Função para ler a última palavra ao pressionar espaço
function Ler_UltimaPalavra(event) {
    if (event.key === ' ') { // Detecta se a tecla pressionada é espaço
        const texto = document.getElementById('code').innerText.trim(); // Obtém o texto do div e remove espaços em branco
        const palavras = texto.split(/\s+/); // Divide o texto em palavras
        const ultimaPalavra = palavras[palavras.length - 1]; // Obtém a última palavra

        const speech = new SpeechSynthesisUtterance(`Palavra digitada: ${ultimaPalavra}`); // Cria um objeto de síntese de fala com a última palavra
        configureUtterance(speech); // Configura os parâmetros da fala
        Iniciar_Leitura(speech); // Inicia a leitura
        console.log(`Última palavra: ${ultimaPalavra}`); // mostra o texto que será lido no console do navegador
    }
}

// Event listener para ler elementos focados ao pressionar Tab
document.addEventListener('focusin', Ler_Elementos); // Adiciona um listener para o evento de foco

// Configura eventos específicos para o campo de código
const codeField = document.getElementById('code'); // Obtém o campo de código
codeField.addEventListener('focus', Ler_CampoCodigoFocado); // Lê ao focar no campo
codeField.addEventListener('keydown', Ler_UltimaPalavra); // Lê a última palavra ao pressionar espaço

// Para simular a digitação no campo de código
codeField.addEventListener('keydown', (event) => {
    // A cada tecla pressionada, você pode ler o que está sendo digitado, se necessário
    const textoAtual = codeField.innerText; // Obtém o texto atual
    const speech = new SpeechSynthesisUtterance(`${textoAtual}`);
    configureUtterance(speech);
    Iniciar_Leitura(speech);
});
