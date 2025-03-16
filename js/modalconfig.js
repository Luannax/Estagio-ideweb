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


    $(document).on('submit', '#form_menuGeral_cadastrar', function (event) {
        const iniciarLeitor = document.getElementById("iniciar_leitor").value;
            const idioma = document.getElementById("languageSelect").value;

            // Pega o ID e nome do usuário logado via uma requisição GET
            fetch("/usuarioLogado")
                .then(response => response.json())
                .then(userData => {
                    if (userData.STATUS === "ERROR") {
                        alert("Erro: " + userData.MSG);
                    } else {
                        const userId = userData.userId;
                        const userName = userData.userName;

                        // Agora faz a requisição para salvar a configuração
                        fetch("/salvarConfiguracao", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ 
                                iniciar_leitor: iniciarLeitor, 
                                idioma: idioma,
                                user_id: userId,       // Envia o userId
                                user_name: userName    // Envia o userName
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.STATUS === "OK") {
                                alert("Configurações salvas com sucesso!");
                            } else {
                                alert("Erro: " + data.MSG);
                            }
                        })
                        .catch(error => console.error("Erro ao salvar:", error));
                    }
                })
                .catch(error => {
                    console.error("Erro ao obter dados do usuário:", error);
                    alert("Erro ao obter dados do usuário.");
                });
        });

});
