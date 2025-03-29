
// Função para abrir um arquivo
function abrirArquivo(event) {
    var arquivo = event.target.files[0]; // Obtém o arquivo selecionado
    if (!arquivo) return;

    var reader = new FileReader(); // Cria um FileReader
    reader.onload = function(event) {
        var texto = event.target.result; // Obtém o conteúdo do arquivo
        ace.edit("code").setValue(texto, -1); // Define o conteúdo no editor ACE
    };
    reader.readAsText(arquivo); // Lê o arquivo como texto
}
// Adiciona os ouvintes de eventos aos botões
document.getElementById('file-input').addEventListener('change', abrirArquivo);

//implementar o salvare compartilhar
