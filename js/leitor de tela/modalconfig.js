/*----------------------- Configuração dos Modais -----------------------*/
document.addEventListener("DOMContentLoaded", function () {
    fetch("/getIdiomas")
        .then(response => response.json())
        .then(idiomas => {
            const languageSelect = document.getElementById("languageSelect");
            if (languageSelect) {
                languageSelect.innerHTML = "";
                idiomas.forEach(idioma => {
                    const option = document.createElement("option");
                    option.value = idioma.id;
                    option.textContent = idioma.nome;
                    languageSelect.appendChild(option);
                });
            }
            // Carregar vozes depois dos idiomas
            return fetch("/getVozes");
        })
        .then(response => response.json())
        .then(vozes => {
            const voiceSelect = document.getElementById("voiceSelect");
            if (voiceSelect) {
                voiceSelect.innerHTML = "";
                vozes.forEach(voz => {
                    const option = document.createElement("option");
                    option.value = voz.id;
                    option.textContent = voz.nome;
                    voiceSelect.appendChild(option);
                });
            }
            // Só agora busque as configurações do usuário
            return fetch("/getConfiguracoes");
        })
        .then(response => response.json())
        .then(data => {
            if (data.STATUS === "ERROR") {
                console.error("Erro ao carregar configurações:", data.MSG);
            } else {
                $('#form_config #languageSelect').val(data.idioma_id);
                $('#form_config #voiceSelect').val(data.voz_id);
                $('#form_config #velocidade').val(data.velocidade);

                AtualizarConfiguracoesLeitor({
                    idioma: data.idioma_nome,
                    velocidade: data.velocidade,
                    voz: data.voz_nome
                });
            }
        })
        .catch(error => console.error("Erro ao carregar dados:", error));


    // Salvar configurações do formulário
    $(document).on('submit', '#form_config', function (event) {
        event.preventDefault();
        var languageSelect_id = $('#form_config #languageSelect').val();
        var languageSelect_nome = $('#form_config #languageSelect option:selected').text();
        var voiceSelect_id = $('#form_config #voiceSelect').val();
        var voiceSelect_nome = $('#form_config #voiceSelect option:selected').text();
        var velocidade = $('#form_config #velocidade').val();

        console.log({
            languageSelect_id,
            languageSelect_nome,
            voiceSelect_id,
            voiceSelect_nome,
            velocidade
        });

        // Atualize as configurações do leitor de tela
        AtualizarConfiguracoesLeitor({
            idioma: languageSelect_nome,
            velocidade: velocidade,
            voz: voiceSelect_nome
        });

        $.post('/salvarConfiguracoes', {languageSelect_id, languageSelect_nome, voiceSelect_id, voiceSelect_nome, velocidade })
            .done(function (response) {
                alert('Configurações salvas com sucesso!');
                console.log("Configurações salvas com sucesso:", response);

                // Atualizar configurações globais
                configuracoes.idioma = languageSelect_nome;
                configuracoes.velocidade = parseFloat(velocidade);

                // // Aplicar configurações ao leitor de tela
                // configuracaoVozApi({
                //     idioma: configuracoes.idioma,
                //     velocidade: configuracoes.velocidade
                // });
            })
            .fail(function (error) {
                alert('Erro ao salvar configurações');
                console.error("Erro ao salvar configurações:", error);
            });
    });
});
/*----------------------------------- Fim -------------------------------*/
