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
