$(document).ready(function () {
    console.log("Script carregado");

    // CADASTRAR USUÁRIO
    $('#registerModal').on('shown.bs.modal', function () {
        $('#form_registar_user #nome_registro').focus().select();
    });

    $(document).on('submit', '#form_registar_user', function (event) {
        event.preventDefault();
        var nome = $('#nome_registro').val();
        var email = $('#email_registro').val();
        var matricula = $('#matricula_registro').val();
        var senha = $('#senha_registro').val();

        if (!nome || !email || !matricula || !senha) {
            alert("Todos os campos devem ser preenchidos!");
            return;
        }

        $.post('/cadastrar', { nome, email, matricula, senha })
        .done(function (response) {
            if (response.STATUS === 'OK') {
                alert(response.MSG);
                $('#registerModal').modal('hide');
                $('#form_registar_user')[0].reset();
            } else {
                alert(response.MSG);
            }
        })
        .fail(function () {
            alert("Erro ao comunicar com o servidor.");
        });
    });

   
    // Função para alternar a visibilidade dos botões de login e logout
    function toggleLoginButtons(isLoggedIn, userName) {
        if (isLoggedIn) {
            $('#loginButton').addClass('d-none');
            $('#userInfo').removeClass('d-none');
            $('#userInfo').prepend(`<span class="me-2">${userName}</span>`);
        } else {
            $('#loginButton').removeClass('d-none');
            $('#userInfo').addClass('d-none');
            $('#userInfo span').remove();
        }
    }


    // Verificar se o usuário está logado ao carregar a página
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName');
    toggleLoginButtons(isLoggedIn, userName);

    // LOGIN USUÁRIO
    $('#sigaaModal').on('shown.bs.modal', function () {
        $('#form_login_sigaa #matricula').focus().select();
    });

    $(document).on('submit', '#form_login_sigaa', function (event) {
        event.preventDefault();

        const usarFaceId = $('#faceIdOption').is(':checked');
    
        if (usarFaceId) {
            $('#sigaaModal').modal('hide');
            window.location.href = '/modals/faceid.html'; // redireciona para reconhecimento facial
            return;
        }
    
        const matricula = $('#form_login_sigaa #matricula').val();
        const senha = $('#form_login_sigaa #senha').val();
    
        if (matricula === "" || senha === "") {
            alert("Por favor, preencha todos os campos.");
            return;
        }
    
        $.post('/login', { matricula, senha }, function (response) {
            if (response.ERRO === 0) {
                alert('Login bem-sucedido!');
                $('#sigaaModal').modal('hide').on('hidden.bs.modal', function () {
                    $('.modal-backdrop').remove();
                });
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', response.NOME);
                localStorage.setItem('userId', response.ID);
                toggleLoginButtons(true, response.NOME);
            } else {
                alert(response.MSG);
            }
        }).fail(function () {
            alert('Erro na comunicação com o servidor.');
        });
    });
    

    // Logout sair da conta
    $('#logoutButton').on('click', function () {
        // Chamar a rota de logout no backend
        $.post('/logout', function (response) {
            if (response.STATUS === "OK") {
                // Remover dados do localStorage
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userName');
                localStorage.removeItem('userId');

                // Atualizar a interface
                toggleLoginButtons(false);
                alert(response.MSG);
            } else {
                alert(response.MSG);
            }
        }).fail(function () {
            alert('Erro ao comunicar com o servidor.');
        });
    });
});

$(document).on('click', '#registerLink', function (event) {
    event.preventDefault(); // Impede o comportamento padrão do link
    $('#sigaaModal').modal('hide'); // Fecha o modal de login
    $('#sigaaModal').on('hidden.bs.modal', function () {
        $('#registerModal').modal('show'); // Abre o modal de registro
        $(this).off('hidden.bs.modal'); // Remove o evento para evitar múltiplas execuções
    });
});

function loadUserConfigurations() {
    fetch('/getConfiguracoes')
        .then(response => response.json())
        .then(data => {
            if (data.STATUS === "ERROR") {
                console.error("Erro ao carregar configurações:", data.MSG);
            } else {
                console.log("Configurações carregadas:", data);

                // Preencher os campos do modal com as configurações salvas
                $('#form_config #iniciar_leitor').val(data.iniciar_leitor);
                $('#form_config #languageSelect').val(data.idioma_id);
                $('#form_config #voiceSelect').val(data.voz_id);
                $('#form_config #velocidade').val(data.velocidade);
            }
        })
        .catch(error => console.error("Erro ao buscar configurações:", error));
}