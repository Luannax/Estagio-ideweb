// Define o pre como o editor da pagina web e altera o tema do editor
let codeEditor = ace.edit("code", {
    mode: "ace/mode/python",
    selectionStyle: "text"
})
let defaultCode = '#Pressione Shift-Tab para desativar a navegação com Tab pelo Editor\nprint("Hello World!")';
// Tema
//codeEditor.setTheme("ace/theme/one_dark");
// Escolhendo a linguagem
codeEditor.session.setMode("ace/mode/python");
// Valor padrao no editor
codeEditor.setValue(defaultCode);
// cria a variavel pyodideReadyPromise (interpretador)
let pyodide;
    let pyodideReadyPromise;

    // Função para carregar Pyodide
    async function loadPyodideAndPackages() {
        try {
            pyodideReadyPromise = await loadPyodide();
            console.log("Pyodide carregado com sucesso.");
        } catch (error) {
            console.error("Erro ao carregar Pyodide:", error);
            document.getElementById("terminal").value = "Erro ao carregar Pyodide: " + error;
        }
    }
    
    // função para limpar o terminal a cada execução
    function clearTerminal() {
        document.getElementById("terminal").value = ""; // Limpa o conteúdo do terminal
    }
    
    // Adiciona um event listener ao botão para executar o código
    document.querySelector('.btn-success').addEventListener('click', function() {
        clearTerminal(); // Limpa o terminal antes de executar o código
        callRunPythonCode(); // Chama a função para executar o código Python
    });

    // Passa o codigo do editor na primeira vez que o Run for acionado
    async function callRunPythonCode() {
        const code = codeEditor.getValue().split("\n");
        runPythonCode(code)

    }
    let codeAfterInput;
    async function runPythonCode(params) {
        try {
            if (!pyodide) {
                pyodide = await pyodideReadyPromise;
            }

            // Obtém o código Python do editor
            let code = params

            // Encontra a linha completa onde o input() está presente
            let inputLineIndex = -1;
            for (let i = 0; i < code.length; i++) {
                if (code[i].includes('input(')) {
                    inputLineIndex = i;
                    break;
                }
            }

            // Verifica se encontrou o input
            if (inputLineIndex !== -1) {
                // Divide o código: até a linha com input() (inclusive) e o restante
                let codeBeforeInput = code.slice(0, inputLineIndex).join("\n");
                codeAfterInput = code.slice(inputLineIndex).join("\n");

                // Redireciona o stdout para capturar o resultado do print
                pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
                `);

                // Executa o código até a linha do input() (inclusive)
                pyodide.runPython(codeBeforeInput);

                // Captura a saída redirecionada até o input
                let result = pyodide.runPython('sys.stdout.getvalue()');
                document.getElementById("terminal").value += result;

                // Exibe a pergunta do input() no textarea e espera a resposta
                let inputPrompt = code[inputLineIndex].match(/input\("([^"]+)"\)/);
                if (inputPrompt) {
                    let pergunta = inputPrompt[1];
                    document.getElementById("terminal").value += `${pergunta}\n`;

                    // Permite edição do textarea para o usuário digitar a resposta
                    document.getElementById("terminal").readOnly = false;
                    document.getElementById("terminal").focus();
                    document.getElementById("terminal").placeholder = "Digite sua resposta aqui...";

                    // Adiciona um listener para capturar a resposta do usuário
                    document.getElementById("terminal").addEventListener('keydown', async function(event) {
                        if (event.key === 'Enter' && !event.shiftKey) { // Detecta Enter (sem Shift)
                            event.preventDefault(); // Evita nova linha
                    
                            // Captura a última linha digitada como resposta do usuário
                            let terminalLines = this.value.split("\n");
                            let userInput = terminalLines[terminalLines.length - 1].trim(); // Última linha digitada pelo usuário
                    
                            if (userInput) {
                                //this.value += `\nVocê: ${userInput}\n`; // Mostra a resposta no terminal
                                
                                // Substitui a chamada ao input() com a resposta do usuário
                                let modifiedCode = codeAfterInput.replace(/input\("([^"]+)"\)/, `'${userInput}'`);
                                let modifiedCodeInput = modifiedCode.split("\n")

                            // Encontra a linha completa onde o input() está presente, se tiver
                            let inputLineIndex = -1;
                            for (let i = 0; i < modifiedCodeInput.length; i++) {
                                if (modifiedCodeInput[i].includes('input(')) {
                                    inputLineIndex = i;
                                    break;
                                }
                            }

                            // se ainda tiver input no codigo executa a funcão recursivamente
                            if(inputLineIndex != -1) {
                                runPythonCode(modifiedCodeInput)
                            }else{
                                // Redireciona o stdout para capturar o resultado do print
                                pyodide.runPython(`
                                    import sys
                                    from io import StringIO
                                    sys.stdout = StringIO()
                                                `);
                                    
                                                // Executa o código modificado (com a resposta do input)
                                                pyodide.runPython(modifiedCode);
                                    
                                                // Captura a saída redirecionada
                                                let result = pyodide.runPython('sys.stdout.getvalue()');
                                                this.value += result;
                                    
                                                // Desabilita a edição após a resposta
                                                this.readOnly = true;
                                } 
                            
                            }
                        }
                    });
                }
            } else {
                // Caso não haja input(), apenas executa todo o código
                pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
                `);
                pyodide.runPython(code.join("\n"));
                let result = pyodide.runPython('sys.stdout.getvalue()');
                document.getElementById("terminal").value += result;
            }

        } catch (error) {
            document.getElementById("terminal").value = "Erro ao executar Python: " + error;
            console.error("Erro:", error);
        }
    }

// Carrega o Pyodide ao carregar a página
window.onload = loadPyodideAndPackages;


// Opcoes adicionais
codeEditor.setOptions({
    fontSize: '14pt',
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
});




// faz a seta Up mover sempre para o começo da linha anterior
codeEditor.commands.addCommand({
    name: 'moveToPrevLineStart',
    bindKey: { win: 'Up', mac: 'Up' },
    exec: function (editor) {
        const position = editor.getCursorPosition();
        editor.moveCursorTo(position.row - 1, 0);
    },
    readOnly: false
});

// Faz a seta Down mover sempre para o começo da proxima linha
codeEditor.commands.addCommand({
    name: 'moveToNextLineStart',
    bindKey: { win: 'Down', mac: 'Down' },
    exec: function (editor) {
        const position = editor.getCursorPosition();
        editor.moveCursorTo(position.row + 1, 0);
    },
    readOnly: false
});


// controla se o tab está ativo ou desativo
let tabNavigationEnabled = true;
function toggleTabNavigation() {
    if (tabNavigationEnabled) {
        disableTab();
    } else {
        enableTab();
    }
    tabNavigationEnabled = !tabNavigationEnabled;
}

// desativa a navegação com tab
function disableTab() {
    codeEditor.commands.bindKey("Tab", null);
    codeEditor.commands.bindKey("Shift-Tab", null);
}

// ativa a navegação com tab
function enableTab() {
    codeEditor.commands.bindKey("Tab", "insertTab");
    codeEditor.commands.bindKey("Shift-Tab", "outdent");
}

// Comando Ctrl + Tab para ativar ou desativar a navegação com tab
codeEditor.commands.addCommand({
    name: 'toggleTabNavigation',
    bindKey: { win: 'Shift-Tab', mac: 'Shift-Tab' },
    exec: function () {
        toggleTabNavigation();
    },
    readOnly: false
});