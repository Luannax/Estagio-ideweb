// Função para configurar os parâmetros da fala
function configureUtterance(speech) {
    speech.lang = 'pt-BR'; // Define o idioma como português do Brasil
    speech.rate = 1; // Define a velocidade da fala
    speech.pitch = 1; // Define o tom da fala
    speech.volume = 1; // Define o volume da fala
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
    configureUtterance(speech);
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
            speech.text = linhaAtual
            console.log(`Lendo: ${speech.text}`); // Loga o texto que será lido
            configureUtterance(speech); // Configura os parâmetros da fala
            
            if(codeLinha < linhas.length) { // não ira ler se for a ultima linha do codigo, pois já será realizada ao fim da função
                Iniciar_Leitura(speech); // Inicia a leitura
            }
            codeLinha++
            }
            
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
    configureUtterance(speech); // Configura os parâmetros da fala
    Iniciar_Leitura(speech); // Inicia a leitura
}

// Event listener para ler elementos focados ao pressionar Tab
document.addEventListener('focusin', Ler_Elementos);

// Event listener para comandos de teclado
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();

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


//(FIZ ESSAS ANOTAÇÕES ABAIXO PRA MIM NÃO ESQUECER ONDE PAREI KKKK)
// - add a navegação por setas e espaço para ler quando o user add um codigo 
// - fazer com que o leitor de tela leia o codigo pausando linha por linha, sem que fique uma leitra continua sem pausa.


// Função para ler o conteúdo digitado nos campos de input
function LerInputDigitado(event) {
    const input = event.target; // Obtém o campo de input onde o evento ocorreu
    const speech = new SpeechSynthesisUtterance(); // Cria um novo objeto de síntese de fala

    if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
        const textoDigitado = input.value; // Obtém o valor atual do input
        speech.text = textoDigitado ? `Você digitou: ${textoDigitado}` : "Campo vazio"; // Lê o texto digitado ou informa que está vazio
        configureUtterance(speech); // Configura os parâmetros da fala
        Iniciar_Leitura(speech); // Inicia a leitura
    }
}

// Adiciona o listener de entrada de texto para todos os inputs e textareas no modal
const inputs = document.querySelectorAll('input, textarea');
inputs.forEach(input => {
    input.addEventListener('input', LerInputDigitado); // Lê o conteúdo digitado em tempo real
});
