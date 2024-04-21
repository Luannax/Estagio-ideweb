// Função para salvar o código em um arquivo
function salvarCodigo() {
    // Obtém o código do textarea
    var codigo = document.getElementById('code').value;

    // Cria um novo Blob com o código
    var blob = new Blob([codigo], {type: "text/plain;charset=utf-8"});

    // Cria uma URL para o Blob
    var url = URL.createObjectURL(blob);

    // Cria um link de download para o Blob
    var link = document.createElement('a');
    link.download = 'codigo.' + (linguagemAtual === 'Python' ? 'py' : 'por');
    link.href = url;

    // Simula um no link de download
    link.click();
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
        document.getElementById('code').value = texto;
    };

    // Lê o arquivo como texto
    reader.readAsText(arquivo);
}

// Adiciona um ouvinte de evento ao elemento de entrada de arquivo
document.getElementById('file-input').addEventListener('change', abrirArquivo);

// Simula um clique no elemento de entrada de arquivo quando o botão Abrir arquivo é clicado
document.querySelector('.btn-abrir').addEventListener('click', function() {
    document.getElementById('file-input').click();
});



// Função para compartilhar o código
function compartilharCodigo() {
    // Obtém o código do textarea
    var codigo = document.getElementById('code').value;

    // Cria um novo URLSearchParams
    var params = new URLSearchParams();

    // Adiciona o código aos parâmetros de consulta
    params.append('codigo', codigo);

    // Cria uma nova URL com os parâmetros de consulta
    var url = window.location.origin + window.location.pathname + '?' + params.toString();

    // Copia a URL para a área de transferência
    navigator.clipboard.writeText(url).then(function() {
        alert('Link copiado para a área de transferência!');
    }, function() {
        alert('Falha ao copiar link!');
    });
}

// Adiciona um ouvinte de evento ao botão de compartilhar
document.querySelector('.btn-compartilhar').addEventListener('click', compartilharCodigo);


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
        linguagemAtual = 'Portugol';
    }
}

// Adiciona um ouvinte de evento ao select
document.querySelector('.form-select').addEventListener('change', mudarLinguagem);