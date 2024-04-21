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


// Adiciona um ouvinte de evento ao select
document.querySelector('.form-select').addEventListener('change', mudarLinguagem);

$(document).ready(function() {
    $('.btn-compartilhar').click(compartilharCodigo);

    $('.form-select').change(function(event) {
        var valor = event.target.value;

        if (valor === '1') {
            linguagemAtual = 'Python';
        } else if (valor === '2') {
            linguagemAtual = 'Portugol';
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
