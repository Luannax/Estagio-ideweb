$(document).ready(function () {
    console.log("Script carregado");

    // Remover backdrop manualmente ao fechar o modal
    $('#registerModal').on('hidden.bs.modal', function () {
        $('.modal-backdrop').remove();
    });

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

    // Remover backdrop manualmente ao fechar o modal
    $('#sigaaModal').on('hidden.bs.modal', function () {
        $('.modal-backdrop').remove();
    });

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
        var matricula = $('#form_login_sigaa #matricula').val();
        var senha = $('#form_login_sigaa #senha').val();

        if (matricula === "" || senha === "") {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        $.post('/login', { matricula: matricula, senha: senha }, function (response) {
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
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        toggleLoginButtons(false);
        alert('Você saiu com sucesso!');
    });

    // Função para salvar as configurações do leitor de tela
    function saveScreenReaderSettings(settings) {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            const userId = localStorage.getItem('userId');
            $.post('/saveSettings', { userId, settings }, function (response) {
                if (response.STATUS === 'OK') {
                    alert('Configurações salvas com sucesso!');
                } else {
                    alert(response.MSG);
                }
            }).fail(function () {
                alert('Erro ao salvar configurações.');
            });
        } else {
            alert('Você precisa estar logado para salvar as configurações.');
        }
    }

    // Exemplo de uso da função saveScreenReaderSettings
    $('#aplicarConfig').on('click', function () {
        const settings = {
            deviceType: $('#tipo').val(),
            startReader: $('#iniciar_leitor').val(),
            language: $('#languageSelect').val()
        };
        saveScreenReaderSettings(settings);
    });

    $('#applyVoiceSettings').on('click', function () {
        const settings = {
            voice: $('#voiceSelect').val(),
            speed: $('#voiceSpeed').val(),
            pitch: $('#voicePitch').val(),
            volume: $('#voiceVolume').val()
        };
        saveScreenReaderSettings(settings);
    });
});