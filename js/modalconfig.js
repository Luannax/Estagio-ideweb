// Função para abrir o modal de acessibilidade
function abrirModalAcessibilidade() {
    var modal = new bootstrap.Modal(document.getElementById('modalAcessibilidade'));
    modal.show();
}

// Adiciona um ouvinte de evento ao botão de acessibilidade
document.querySelector('.btn-acessibilidade').addEventListener('click', abrirModalAcessibilidade);