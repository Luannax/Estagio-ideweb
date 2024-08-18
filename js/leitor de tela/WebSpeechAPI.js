// Variáveis globais para armazenar configurações de voz
let selectedVoice = null;
let selectedRate = 1;
let selectedPitch = 1;
let selectedVolume = 1;

// Função para configurar o utterance com as configurações globais
function configureUtterance(utterance) {
    utterance.voice = selectedVoice;
    utterance.rate = selectedRate;
    utterance.pitch = selectedPitch;
    utterance.volume = selectedVolume;
}

// Função para ler o título do site
function readTitle() {
    var speech = new SpeechSynthesisUtterance();
    speech.text = "Ambiente de Desenvolvimento Integrado Web com Leitor de Tela";
    window.speechSynthesis.speak(speech);
}

// Variável para armazenar a instância do SpeechSynthesisUtterance atual
let currentSpeech = null;

// Função para ler o elemento focado via tab
function readFocusedElement() {
    if (currentSpeech) {
        window.speechSynthesis.cancel();
    }

    const focusedElement = document.activeElement;
    const speech = new SpeechSynthesisUtterance();

    if (focusedElement.tagName === 'A') {
        const img = focusedElement.querySelector('img');
        speech.text = img && img.alt ? "Ícone: " + img.alt : "Link: " + focusedElement.textContent;
    } else if (focusedElement.tagName === 'BUTTON') {
        speech.text = focusedElement.getAttribute('aria-label') || "Botão: " + focusedElement.textContent;
    } else if (focusedElement.tagName === 'SELECT') {
        const selectedOption = focusedElement.options[focusedElement.selectedIndex];
        speech.text = focusedElement.getAttribute('aria-label') + ", opção selecionada: " + selectedOption.text;
    } else if (focusedElement.classList.contains('container-btn-toggle')) {
        const switchElement = focusedElement.querySelector('#switch');
        speech.text = switchElement.checked ? "Tema escuro ativado" : "Tema claro ativado";
    } else if (focusedElement.classList.contains('modal-title') || focusedElement.classList.contains('modal-body')) {
        speech.text = focusedElement.textContent;
    } else {
        speech.text = " " + focusedElement.tagName + ", " + focusedElement.textContent;
    }

    // Configura e fala
    configureUtterance(speech);
    currentSpeech = speech;
    speech.onend = function() {
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

/**Evento para ler o título quando a página é carregada
window.addEventListener('DOMContentLoaded', function() {
    var speech = new SpeechSynthesisUtterance();
    speech.text = "Ambiente de Desenvolvimento Integrado Web com Leitor de Tela";
    window.speechSynthesis.speak(speech);
});*/

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



//Menu Geral
document.addEventListener('DOMContentLoaded', (event) => {
    const deviceType = document.getElementById('deviceType');
    const saveSettings = document.getElementById('saveSettings');
    const startNVDA = document.getElementById('startNVDA');
    const languageSelect = document.getElementById('languageSelect');
    const applySettings = document.getElementById('applySettings');
    const settingsMessage = document.getElementById('settingsMessage');

    const translations = {
        en: {
            deviceTypeLabel: "Device Type",
            desktopOption: "Desktop",
            notebookOption: "Notebook",
            saveSettingsLabel: "Save settings on exit",
            startNVDALabel: "Start NVDA when opening the page",
            languageSelectLabel: "Select Language",
            portugueseOption: "Portuguese",
            englishOption: "English",
            applyButton: "Apply",
            settingsMessage: "Settings applied successfully!"
        },
        pt: {
            deviceTypeLabel: "Tipo de dispositivo",
            desktopOption: "Computador de mesa",
            notebookOption: "Notebook",
            saveSettingsLabel: "Salvar configurações ao sair",
            startNVDALabel: "Iniciar o NVDA quando abrir a página",
            languageSelectLabel: "Selecionar o idioma",
            portugueseOption: "Português",
            englishOption: "Inglês",
            applyButton: "Aplicar",
            settingsMessage: "Configurações aplicadas com sucesso!"
        }
    };

    // Carregar configurações salvas
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('settings')) || {};
        if (settings.deviceType) deviceType.value = settings.deviceType;
        if (settings.saveSettings !== undefined) saveSettings.checked = settings.saveSettings;
        if (settings.startNVDA !== undefined) startNVDA.checked = settings.startNVDA;
        if (settings.languageSelect) languageSelect.value = settings.languageSelect;
        applyTranslations(settings.languageSelect || 'pt');
    }

    // Salvar configurações
    function saveSettingsToLocalStorage() {
        const settings = {
            deviceType: deviceType.value,
            saveSettings: saveSettings.checked,
            startNVDA: startNVDA.checked,
            languageSelect: languageSelect.value
        };
        localStorage.setItem('settings', JSON.stringify(settings));
        console.log('Configurações salvas:', settings); // Adicionado para verificação
    }

    // Verificar configurações salvas
    function verifySettings() {
        const savedSettings = JSON.parse(localStorage.getItem('settings'));
        console.log('Configurações verificadas:', savedSettings);
        return savedSettings;
    }

    // Aplicar traduções
    function applyTranslations(language) {
        const elements = document.querySelectorAll('[data-lang]');
        elements.forEach(element => {
            const key = element.getAttribute('data-lang');
            element.textContent = translations[language][key];
        });
    }

    // Configurar a voz da API Web Speech
    function configureSpeechSynthesis(language) {
        const utterance = new SpeechSynthesisUtterance();
        utterance.lang = language;
        utterance.text = translations[language].settingsMessage;
        speechSynthesis.speak(utterance);
    }

    // Aplicar configurações
    applySettings.addEventListener('click', () => {
        if (saveSettings.checked) {
            saveSettingsToLocalStorage();
        }
        if (startNVDA.checked) {
            // Lógica para iniciar o NVDA
            console.log('Iniciando NVDA...');
        }
        console.log('Linguagem selecionada:', languageSelect.value); // Verificar linguagem selecionada
        applyTranslations(languageSelect.value);
        configureSpeechSynthesis(languageSelect.value); // Configurar a voz da API Web Speech
        settingsMessage.style.display = 'block';
        setTimeout(() => {
            settingsMessage.style.display = 'none';
        }, 3000);
        verifySettings(); // Chamar a função de verificação
    });

    // Carregar configurações ao iniciar a página
    loadSettings();
});
    
//Menu de Fala/Audio
document.addEventListener('DOMContentLoaded', () => {
    const voiceSelect = document.getElementById('voiceSelect');
    const voiceSpeed = document.getElementById('voiceSpeed');
    const voicePitch = document.getElementById('voicePitch');
    const voiceVolume = document.getElementById('voiceVolume');
    const applyVoiceSettings = document.getElementById('applyVoiceSettings');
    const voiceSettingsMessage = document.getElementById('voiceSettingsMessage');

    let voices = [];

    // Carregar vozes disponíveis
    function loadVoices() {
        voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = '';
        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.value = index;
            voiceSelect.appendChild(option);
        });
    }

    // Aplicar configurações de voz globalmente
    function applyVoiceSettingsFunc() {
        selectedVoice = voices[voiceSelect.value];
        selectedRate = voiceSpeed.value;
        selectedPitch = voicePitch.value;
        selectedVolume = voiceVolume.value;

        voiceSettingsMessage.style.display = 'block';
        setTimeout(() => {
            voiceSettingsMessage.style.display = 'none';
        }, 3000);

        speak("Configurações de voz aplicadas com sucesso!");
    }

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        configureUtterance(utterance);
        speechSynthesis.speak(utterance);
    }

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }

    applyVoiceSettings.addEventListener('click', applyVoiceSettingsFunc);

    window.speak = speak;
});
