/*----------------------- Configuração do Leitor de tela-----------------------*/
// Definição de configurações padrão
const configuracoes = {
    idioma: 'pt-BR' , // Idioma padrão
    velocidade: 1, // Velocidade padrão
    tom: 1, // Tom padrão
    volume: 1, // Volume padrão
    voz: 'Microsoft Daniel Desktop' // Voz padrão
};

// Função para atualizar as configurações do leitor de tela
function AtualizarConfiguracoesLeitor({ idioma, velocidade, voz }) {
    if (idioma) configuracoes.idioma = idioma;
    if (velocidade) configuracoes.velocidade = parseFloat(velocidade);
    if (voz) configuracoes.voz = voz;
}

// Função para configurar os parâmetros da fala
function configuracaoVozApi(speech) {
    speech.lang = configuracoes.idioma || 'pt-BR';
    speech.rate = configuracoes.velocidade || 1;
    speech.pitch = configuracoes.tom || 1;
    speech.volume = configuracoes.volume || 1;

    // Aplica a voz selecionada, se existir
    if (configuracoes.voz) {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.name === configuracoes.voz);
        if (selectedVoice) {
            speech.voice = selectedVoice;
        }
    }
}

// Função para iniciar a leitura
function Iniciar_Leitura(speech) {
    window.speechSynthesis.speak(speech); // Inicia a síntese de fala com o objeto speech
}
// Função para pausar a leitura
function Pausar_Leitura() {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
    }
}

// Função para retomar a leitura
function Retomar_Leitura() {
    if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
    }
}

// Função para cancelar a leitura
function Cancelar_Leitura() {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
}

// Função para ler o nome do site
function Ler_Nome_Site() {
    const speech = new SpeechSynthesisUtterance();
    speech.text = document.title; // Obtém o título do site
    configuracaoVozApi(speech);
    Iniciar_Leitura(speech);
}

// Função para descrever cada caractere especial ou retornar a palavra diretamente
function DescreverCaractereOuPalavra(texto) {
    // Mapeamento de caracteres especiais
    const caracteresEspeciais = {
        '(': "abre parênteses",
        ')': "fecha parênteses",
        '{': "abre chaves",
        '}': "fecha chaves",
        '[': "abre colchetes",
        ']': "fecha colchetes",
        '"': "aspas duplas",
        "'": "aspas simples",
        ';': "ponto e vírgula",
        '.': "ponto",
        ',': "vírgula",
        ':': "dois pontos",
        '?': "ponto de interrogação",
        '!': "ponto de exclamação",
        '-': "traco",
        '_': "underline",
        '/': "barra",
        //'\\': "barra invertida",
        '|': "barra vertical",
        '=': "igual",
        '+': "mais",
        '*': "asterisco",
        '&': "e comercial",
        '%': "por cento",
        '#': "hashtag",
        '@': "arroba",
        '$': "dólar",
        '<': "menor que",
        '>': "maior que",
        '^': "circunflexo",
        '~': "til",
        '`': "crase",
        '\t': "tabulação",
        '\n': "quebra de linha",
        '\r': "retorno de carro",
        '\b': "backspace",
        '\f': "form feed",
        '\v': "tabulação vertical"
    };
    
    // Se o texto for um caractere especial, retorna sua descrição
    if (texto.length === 1 && caracteresEspeciais[texto]) {
        return caracteresEspeciais[texto]; // Descreve caracteres especiais
    } else {
        return texto; // Lê palavras completas
    }
}

// Função para ler o código no campo de código, distinguindo palavras e caracteres
function LerCodigoDetalhado(codigo) {
    let descricao = ""; // Inicializa a descrição
    let palavraAtual = ""; // Inicializa a palavra atual

    // Itera sobre cada caractere do código
    for (let i = 0; i < codigo.length; i++) {
        const char = codigo[i]; // Obtém o caractere atual
        // Se for um caractere especial ou espaço, lê a palavra atual e depois o caractere especial
        if (/\s|\W/.test(char) && char !== '_') {
            if (palavraAtual) {
                descricao += palavraAtual + " "; // Adiciona a palavra atual à descrição
                palavraAtual = ""; // Reseta a palavra atual
            }
            descricao += DescreverCaractereOuPalavra(char) + " "; // Adiciona a descrição do caractere especial
        } else {
            // Continua formando uma palavra
            palavraAtual += char; // Adiciona o caractere à palavra atual
        }
    }

    // Adiciona a última palavra à descrição, se houver
    if (palavraAtual) {
        descricao += palavraAtual;
    }

    return descricao.trim(); // Retorna a descrição final sem espaços extras
}

// Função para ler o elemento focado
function Ler_Elementos() {
    // Cancela qualquer fala em andamento
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    const ElementoFocado = document.activeElement; // Obtém o elemento atualmente focado
    const speech = new SpeechSynthesisUtterance(); // Cria um novo objeto de síntese de fala

    // Verifica o tipo de elemento focado e define o texto da fala
    if (ElementoFocado.id === 'code') {
        let codeEditor = ace.edit("code", {
            mode: "ace/mode/python",
            selectionStyle: "text"
        });
        codigo = codeEditor.getValue()
        const codigoADetalhar = codigo.replace(/\n/g, "\\") 
        speech.text = LerCodigoDetalhado(codigoADetalhar); // Lê o código detalhadamente

        const codigoDetalhado = speech.text; 

        // Divide o código em linhas
        const linhas = codigoDetalhado.split("\\")

        let codeLinha = 1;
        for (const linha of linhas) {
            let linhaAtual = "Linha " + codeLinha + " " + linha // adiciona a linha atual do codigo no texto que será lido
            speech.text = linhaAtual + ". Aperte TAB para começar a digitar o seu algoritmo.";
            console.log(`Lendo: ${speech.text}`); // Mostra o texto que será lido
            configuracaoVozApi(speech); // Configura os parâmetros da fala
            
            if(codeLinha < linhas.length) { // não ira ler se for a ultima linha do codigo, pois já será realizada ao fim da função
                Iniciar_Leitura(speech); // Inicia a leitura
            }
            codeLinha++
        }

        const code = document.getElementById('code');
        // Função para ler o texto digitado
        function LerTextDigitado() {
            const code = document.getElementById('code'); // Obtém o elemento com id 'code'
            const text = code.innerText; // Usa innerText para obter o conteúdo do div

            // Se o texto não estiver vazio, fazer a leitura
            if (text.trim() !== '') {
                const speech = new SpeechSynthesisUtterance(text);
                configuracaoVozApi(speech);

                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(speech);
            }
        }
        // Adicionar ouvinte de evento para detectar enquanto o usuário digita
        code.addEventListener('input', function() {
            // Chamar a função que lê o texto enquanto o usuário digita
            LerTextDigitado();
            console.log(`Lendo: ${LerTextDigitado}`);
        }); 
        
            
    } else if (ElementoFocado.tagName === 'A') {
        const img = ElementoFocado.querySelector('img');
        speech.text = img && img.alt ? "Ícone: " + img.alt : "Link: " + ElementoFocado.textContent; // Lê o texto do link ou a descrição da imagem
    } else if (ElementoFocado.hasAttribute('alt')) {
        speech.text = ElementoFocado.getAttribute('alt'); // Lê o atributo alt de qualquer elemento que o possua
    } else if (ElementoFocado.id === "terminal") {
        //em andamento ...
    } else {
        speech.text = ElementoFocado.textContent; // Lê o texto do elemento focado
    } 

    console.log(`Lendo: ${speech.text}`); // Loga o texto que será lido
    configuracaoVozApi(speech); // Configura os parâmetros da fala
    Iniciar_Leitura(speech); // Inicia a leitura
}

// Event listener para ler elementos focados ao pressionar Tab
document.addEventListener('focusin', Ler_Elementos);

// Event listener para comandos de teclado
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();

     if (event.key === "Tab") {
        // Previna o comportamento padrão apenas se necessário
        // event.preventDefault(); 
        Ler_Elementos();
        return;
    }

    switch (key) {
        case 'l': // Lê o nome do site
            Ler_Nome_Site();
            break;
        case 'p': // Pausa a leitura
            Pausar_Leitura();
            break;
        case 'r': // Retoma a leitura
            Retomar_Leitura();
            break;
        case 'tab': // Navega e lê o elemento focado
            Ler_Elementos();
            break;
        default:
            break;
    }
});

const codeField = document.getElementById('code');
codeField.addEventListener('focus', Ler_Elementos); // Adiciona o listener de foco ao campo de código
/*----------------------------------- Fim -------------------------------*/