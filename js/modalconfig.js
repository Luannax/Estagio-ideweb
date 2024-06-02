// Função para abrir o modal de acessibilidade
function abrirModalAcessibilidade() {
    var modal = new bootstrap.Modal(document.getElementById('modalAcessibilidade'));
    modal.show();
}

// Adiciona um ouvinte de evento ao botão de acessibilidade
document.querySelector('.btn-acessibilidade').addEventListener('click', abrirModalAcessibilidade);


// Função para abrir o modal de configurações
function abrirModalConfig() {
    var modal = new bootstrap.Modal(document.getElementById('modalConfig'));
    modal.show();
}



// Adiciona um ouvinte de evento ao botão de acessibilidade
document.querySelector('.btn-config').addEventListener('click', abrirModalConfig);



//Limpa a tela escura
$(document).ready(function() {
    $('.btn-compartilhar').click(compartilharCodigo);

    $('.form-select').change(function(event) {
        var valor = event.target.value;

        if (valor === '1') {
            linguagemAtual = 'Python';
        } else if (valor === '2') {
            linguagemAtual = 'JavaScript';
        }
    });

    $('#modalConfig').on('hidden.bs.modal', function() {
        if($('.modal-backdrop').length > 0) {
            $('.modal-backdrop').remove();
        }
    });
    $('#modalAcessibilidade').on('hidden.bs.modal', function() {
        if($('.modal-backdrop').length > 0) {
            $('.modal-backdrop').remove();
        }
    });
});


//CONFIG GERAL 
document.getElementById('applySettings').addEventListener('click', function() {
    // Get the values from the form
    const deviceType = document.getElementById('deviceType').value;
    const playSounds = document.getElementById('playSounds').checked;
    const saveSettings = document.getElementById('saveSettings').checked;
    const startNVDA = document.getElementById('startNVDA').checked;
    const language = document.getElementById('languageSelect').value;

    // Save settings to local storage or apply them directly
    const settings = {
        deviceType,
        playSounds,
        saveSettings,
        startNVDA,
        language
    };

    // Optionally, save settings to localStorage
    if (saveSettings) {
        localStorage.setItem('screenReaderSettings', JSON.stringify(settings));
    }

    // Apply settings (example logic, adapt as needed)
    console.log('Settings applied:', settings);
    
    // Example: Apply language setting (this will depend on your application logic)
    if (language === 'pt') {
        // Apply Portuguese language settings
    } else if (language === 'en') {
        // Apply English language settings
    } else if (language === 'es') {
        // Apply Spanish language settings
    }
    
    // Example: Start NVDA if checked
    if (startNVDA) {
        // Logic to start NVDA
        console.log('Starting NVDA...');
    }
    
    // Close modal after applying settings
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalConfig'));
    modal.hide();
});

// Load settings from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedSettings = localStorage.getItem('screenReaderSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        document.getElementById('deviceType').value = settings.deviceType;
        document.getElementById('playSounds').checked = settings.playSounds;
        document.getElementById('saveSettings').checked = settings.saveSettings;
        document.getElementById('startNVDA').checked = settings.startNVDA;
        document.getElementById('languageSelect').value = settings.language;
    }
});

