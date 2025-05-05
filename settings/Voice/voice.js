// Reconhecimento de voz
navigator.mediaDevices.enumerateDevices().then(function(devices) {
    devices.forEach(function(device) {
        console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
    });
}).catch(function(err) {
    console.error("Erro ao enumerar dispositivos:", err.message);
});


// Função para iniciar o reconhecimento de voz
function iniciarReconhecimentoVoz() {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        alert('API de reconhecimento de voz não suportada neste navegador.');
        return;
    }

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const reconhecimento = new Recognition();
    reconhecimento.lang = 'pt-BR';
    reconhecimento.interimResults = true; // Mostra resultados parciais para debugging
    reconhecimento.maxAlternatives = 1;
    reconhecimento.continuous = false;


    // Processamento dos comandos
    reconhecimento.onresult = function(event) {
        const comando = event.results[0][0].transcript.toLowerCase();
        console.log('Comando reconhecido:', comando);
        if (!event.results[0].isFinal) {
            return; // Ignora resultados parciais
    }

        if (comando.includes('salvar')) {
            const btnSalvar = document.querySelector('.btn-salvar');
            if (btnSalvar) {
                btnSalvar.click();
                return;
            } else {
                console.error('Elemento btnSalvar não encontrado.');
            }

        } else if (comando.includes('compartilhar')) {
            const btnCompartilhar = document.querySelector('.btn-compartilhar');
            if (btnCompartilhar) {
            btnCompartilhar.click();
                return;
            } else {
            console.error('Elemento btn-compartilhar não encontrado.');
            }

        }else if (comando.includes('executar')){
            const btnsuccess = document.querySelector('.btn-success');
        if (btnsuccess) {
            btnsuccess.click();
        } else {
            console.error('Elemento btnsuccess não encontrado. ');
        }

        } else if (comando.includes('abrir')) {
            document.getElementById('file-input').click();
            return;
        }else{
            alert('Comando não reconhecido.');
        }
    };

    // Tratamento de erros
    reconhecimento.onerror = function(event) {
        console.error('Erro no reconhecimento de voz:', event.error);
        if (event.error === 'no-speech') {
            alert('Nenhum som detectado. Por favor, tente novamente em um ambiente silencioso.');
        } else if (event.error === 'audio-capture') {
            alert('Nenhum dispositivo de áudio detectado. Verifique o microfone.');
        } else if (event.error === 'not-allowed') {
            alert('Permissão negada. Habilite o uso do microfone no navegador.');
        } else {
            alert('Erro desconhecido: ' + event.error);
        }
    };

    // Inicia o reconhecimento
    reconhecimento.start();
    console.log('Reconhecimento de voz iniciado...');
}

// Adiciona um ouvinte de evento ao botão de reconhecimento de voz
document.querySelector('.btn-reconhecimento').addEventListener('click', iniciarReconhecimentoVoz);
    

    // Verifica as permissões do microfone
    navigator.permissions.query({ name: 'microphone' }).then(function(permissionStatus) {
        console.log('Permissão para microfone:', permissionStatus.state);
        if (permissionStatus.state === 'denied') {
            alert('A permissão para o microfone foi negada. Habilite-a nas configurações do navegador.');
            return;
        } else {
            // Inicia o reconhecimento
            reconhecimento.start();
            console.log('Reconhecimento de voz iniciado...');
        }
    });

// ------------------------------------------------------------------------------------------------------------------------

// Função para salvar o código em um arquivo
function salvarCodigo() {
    //Fala a pergunta para o usuário
    var fala = new SpeechSynthesisUtterance("Por favor, diga o nome do arquivo.");
    speechSynthesis.speak(fala);
    
    //Quando terminar de falar, inicia a gravação de voz
    fala.onend = function(){
        //Configura o reconhecimento de voz
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Seu navegador não suporta reconhecimento de voz.");
            return;
        }
    
    var reconhecimento = new SpeechRecognition();
    reconhecimento.lang = 'pt-BR'; // Define para português
    reconhecimento.interimResults = false; // Só resultados finais
    reconhecimento.maxAlternatives = 1; // Apenas a melhor tentativa

    // Inicia o reconhecimento
    reconhecimento.start();

    // Quando capturar o resultado
    reconhecimento.onresult = function(event) {
        var nomeFalado = event.results[0][0].transcript.trim();
        if (!nomeFalado) {
            alert("Não foi possível entender o nome. Tente novamente.");
            return;
        }

        // Obtém o código do editor ACE
        var codigo = ace.edit("code").getValue();

        // Cria um novo Blob com o código
        var blob = new Blob([codigo], { type: "text/plain;charset=utf-8" });

        // Cria uma URL para o Blob
        var url = URL.createObjectURL(blob);

        // Cria um link de download para o Blob
        var link = document.createElement('a');
        link.download = nomeFalado + '.' + (linguagemAtual === 'Python' ? 'py' : 'js');
        link.href = url;

        // Simula um clique no link de download
        link.click();

        // Limpa a URL para evitar vazamento de memória
        URL.revokeObjectURL(url);
    };

    reconhecimento.onerror = function(event) {
        alert("Erro no reconhecimento de voz: " + event.error);
    };
};
}

// Adiciona um ouvinte de evento ao botão de salvar
document.querySelector('.btn-salvar').addEventListener('click', salvarCodigo);



// Função para abrir um arquivo
function abrirArquivo(event) {
    // Obtém o arquivo do evento de entrada
    var arquivo = event.target.files[0];

    // Cria um novo FileReader
    var reader = new FileReader();

    // Define a função de callback para quando o arquivo for lido
    reader.onload = function(event) {
        // Obtém o texto do arquivo
        var texto = event.target.result;

        // Define o texto do textarea para o texto do arquivo
        var editor = ace.edit("code");

        editor.setValue(texto, -1)
        //document.getElementById('code').value = texto;
    };

    // Lê o arquivo como texto
    reader.readAsText(arquivo);
}

// Adiciona um ouvinte de evento ao elemento de entrada de arquivo
document.getElementById('file-input').addEventListener('change', abrirArquivo);

// Simula um clique no elemento de entrada de arquivo quando o botão Abrir arquivo é clicado
//document.querySelector('.btn-abrir').addEventListener('click', function() {
   // document.getElementById('file-input').click();
//});


// Função para compartilhar o código
function compartilharCodigo() {
    // Obtém o código do editor ACE
    var editor = ace.edit("code");
    var codigo = editor.getValue();

    // Cria um novo URLSearchParams
    var params = new URLSearchParams();

    // Adiciona o código aos parâmetros de consulta
    params.append('codigo', codigo);

    // Cria uma nova URL com os parâmetros de consulta
    var url = window.location.origin + window.location.pathname + '?' + params.toString();
    console.log("repetição");

    // Copia a URL para a área de transferência
    navigator.clipboard.writeText(url).then(function() {
        var fala = new SpeechSynthesisUtterance("Link copiado para a área de transferência.");
    SpeechSynthesis.speak(fala);
    return;
    }, function() {
        alert('Falha ao copiar link!');
    });
}

// Adiciona um ouvinte de evento ao botão de compartilhar
document.querySelector('.btn-compartilhar').addEventListener('click', compartilharCodigo);

//---------------------------------------------------------------------------------------------------//

// Função para executar o código do editor
function executar() {
// Obtém o código digitado no editor ACE
    var editor = ace.edit("code");
    var codigo = editor.getValue();

    try {
        // Executa o código diretamente no navegador
        eval(codigo);
    } catch (erro) {
        // Exibe mensagens de erro
        console.error("Erro ao executar o código:", erro);
        alert("Erro ao executar o código: " + erro.message);
    }
}

//Adiciona um ouvinte de evento ao botão de executar
document.querySelector('.btn-success').addEventListener('click', executar);



// Variável para armazenar a linguagem atualmente selecionada
var linguagemAtual = 'Python'; // Valor inicial

// Função para lidar com a mudança de linguagem
function mudarLinguagem(event) {
    // Obtém o valor do select
    var valor = event.target.value;

    // Verifica o valor para determinar a linguagem
    if (valor === '1') {
        linguagemAtual = 'Python';
    } else if (valor === '2') {
        linguagemAtual = 'JavaScript';
    }
}
