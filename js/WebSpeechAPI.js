// Função para ler o título do site
function readTitle() {
    var speech = new SpeechSynthesisUtterance();
    speech.text = "Ambiente de Desenvolvimento Integrado Web com Leitor de Tela";
    window.speechSynthesis.speak(speech);
}

// Variável para armazenar a instância do SpeechSynthesisUtterance
var currentSpeech = null;

// Função para ler o elemento focado via tab
function readFocusedElement() {
    // Verifica se há uma leitura em andamento e a interrompe
    if (currentSpeech) {
        window.speechSynthesis.cancel();
    }

    //Essa parte do código está atribuindo à variável focusedElement o elemento atualmente em foco no documento HTML.
    var focusedElement = document.activeElement;

    // Cria uma nova instância do SpeechSynthesisUtterance
    var speech = new SpeechSynthesisUtterance();

    // Verifica se o elemento focado é um link ou uma imagem
    if (focusedElement.tagName === 'A') {
        var img = focusedElement.querySelector('img');
        if (img && img.alt) {
            speech.text = "Ícone: " + img.alt;
        } else {
            speech.text = "Link: " + focusedElement.textContent;
        }

    // Verifica se o elemento focado é um btn 
    } else if (focusedElement.tagName === 'BUTTON') {
        if (focusedElement.getAttribute('aria-label')) {
            speech.text = "Botão: " + focusedElement.getAttribute('aria-label');
        } else {
            speech.text = "Botão: " + focusedElement.textContent;
        }

    // Verifica se o elemento focado é um select e lista as opções 
    } else if (focusedElement.tagName === 'SELECT') {
        var selectedOption = focusedElement.options[focusedElement.selectedIndex];
        if (focusedElement.getAttribute('aria-label')) {
            speech.text = "Select: " + focusedElement.getAttribute('aria-label') + ", opção selecionada: " + selectedOption.text;
        }
    
        focusedElement.addEventListener('change', function() {
            var selectedOption = this.options[this.selectedIndex];
            var speech = new SpeechSynthesisUtterance();
            speech.text = "Opção selecionada: " + selectedOption.text;
            window.speechSynthesis.speak(speech);
        });

    // Verifica se o elemento focado é toogle que muda para os modos claro e escuro
    } else if (focusedElement.classList.contains('container-btn-toggle')) {
        var switchElement = focusedElement.querySelector('#switch');
        if (switchElement.checked) {
            speech.text = "Tema escuro ativado";
        } else {
            speech.text = "Botão de modo escuro e claro. Tema claro ativado";
        }
    // Verifica se o elemento focado é um modal do btn acessibilidade, e lê quando o usuáro da tab indicando aonde ele está. 
    } else if (focusedElement.classList.contains('modal-title')) {
            speech.text = focusedElement.textContent;
        } else if (focusedElement.classList.contains('close')) {
            speech.text = "Botão: " + focusedElement.getAttribute('aria-label');
        } else if (focusedElement.classList.contains('modal-body')) {
            speech.text =  focusedElement.textContent;
        } else if (focusedElement.classList.contains('btn')) {
            speech.text = focusedElement.textContent;

    // Verifica qual é o elemento focado para a api ler para o usuário
    } else {
        speech.text = " " + focusedElement.tagName + ", " + focusedElement.textContent;
    }

    // Armazena a instância do SpeechSynthesisUtterance atual
    currentSpeech = speech;

    // Evento para quando a leitura é concluída
    speech.onend = function() {
        // Limpa a referência para a instância do SpeechSynthesisUtterance
        currentSpeech = null;
    };

    window.speechSynthesis.speak(speech);
}


// Função para pausar a leitura
function pauseReading() {
    window.speechSynthesis.pause();
}

// Função para retomar a leitura
function resumeReading() {
    window.speechSynthesis.resume();
}


// Evento para ler o título quando a página é carregada
//window.addEventListener('DOMContentLoaded', function() {
//    var speech = new SpeechSynthesisUtterance();
//    speech.text = "Ambiente de Desenvolvimento Integrado Web com Leitor de Tela";
//    window.speechSynthesis.speak(speech);
//});

// Evento para ler o elemento focado quando o usuário navega via tab
window.addEventListener('keyup', function(event) {
    // Verifica se a tecla pressionada é a tecla Tab e não está em um campo de entrada de texto
    if (event.keyCode === 9 && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') { 
        readFocusedElement();
    }
    else if (event.keyCode === 80) { // Verifica se a tecla pressionada é a tecla P
        event.preventDefault(); // Impede o comportamento padrão da tecla de espaço
        pauseReading();
    }
    else if (event.keyCode === 82) { // Verifica se a tecla pressionada é a tecla 'R'
        resumeReading();
    }
    else if (event.keyCode === 76) { // Verifica se a tecla pressionada é a tecla L
        readTitle();
    }
});

