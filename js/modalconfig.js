document.addEventListener("DOMContentLoaded", function () {
    // Carregar idiomas
    fetch("/getIdiomas")
        .then(response => response.json())
        .then(data => {
            const languageSelect = document.getElementById("languageSelect");

            if (languageSelect) {
                languageSelect.innerHTML = "";
                data.forEach(idioma => {
                    const option = document.createElement("option");
                    option.value = idioma.id;
                    option.textContent = idioma.nome;
                    languageSelect.appendChild(option);
                });
            }
        })
        .catch(error => console.error("Erro ao carregar idiomas:", error));

    // Carregar vozes
    fetch("/getVozes")
        .then(response => response.json())
        .then(data => {
            const voiceSelect = document.getElementById("voiceSelect");

            if (voiceSelect) {
                voiceSelect.innerHTML = "";
                data.forEach(voz => {
                    const option = document.createElement("option");
                    option.value = voz.id;
                    option.textContent = voz.nome;
                    voiceSelect.appendChild(option);
                });
            }
        })
        .catch(error => console.error("Erro ao carregar vozes:", error));


    $(document).on('submit', '#form_config', function (event) {
        event.preventDefault();
        var iniciar_leitor = $('#form_config #iniciar_leitor').val();
        var languageSelect_id = $('#form_config #languageSelect').val();
        var languageSelect_nome = $('#form_config #languageSelect option:selected').text();
        var voiceSelect_id = $('#form_config #voiceSelect').val();
        var voiceSelect_nome = $('#form_config #voiceSelect option:selected').text();
        var velocidade = $('#form_config #velocidade').val();

        console.log({
            iniciar_leitor,
            languageSelect_id,
            languageSelect_nome,
            voiceSelect_id,
            voiceSelect_nome,
            velocidade
        });

        $.post('/salvarConfiguracoes', { iniciar_leitor, languageSelect_id, languageSelect_nome, voiceSelect_id, voiceSelect_nome, velocidade })
            .done(function (response) {
                alert('Configurações salvas com sucesso!');
                console.log("Configurações salvas com sucesso:", response);
            })
            .fail(function (error) {
                alert('Erro ao salvar configurações')
                console.error("Erro ao salvar configurações:", error);
            });
    });
});
