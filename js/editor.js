// Adiciona um event listener ao botão para executar o código
document.querySelector('.btn-success').addEventListener('click', runPythonCode);

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

// Função para carregar o Pyodide
async function loadPyodideAndPackages() {
  try {
    // Carrega Pyodide
    pyodideReadyPromise = await loadPyodide();
    console.log("Pyodide carregado com sucesso.");
  } catch (error) {
    console.error("Erro ao carregar Pyodide:", error);
    document.getElementById("output").innerText = "Erro ao carregar Pyodide: " + error;
  }
}

async function runPythonCode() {
    try {
        if (!pyodide) {
            pyodide = await pyodideReadyPromise;
        }

        // Redireciona o stdout para capturar o resultado do print
        pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
        `);

        // Obtém o código Python do editor
        const code = codeEditor.getValue();
        
        // Executa o código Python antes de capturar a pergunta
        pyodide.runPython(code);

        // Captura a saída redirecionada
        let result = pyodide.runPython('sys.stdout.getvalue()');
        document.getElementById("terminal").value += result;

        // Exibe a pergunta no textarea e espera a resposta
        const inputPrompt = code.match(/input\\("([^"]+)"\\)/);
        if (inputPrompt) {
            const pergunta = inputPrompt[1];
            document.getElementById("terminal").value += `\nPergunta: ${pergunta}\n`;
            
            // Permite edição do textarea
            document.getElementById("terminal").readonly = false; // Permite edição
            document.getElementById("terminal").placeholder = "Digite sua resposta aqui...";
            
            // Adiciona um listener para capturar a resposta do usuário
            document.getElementById("terminal").addEventListener('keydown', function(event) {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault(); // Evita nova linha
                    const userInput = this.value.split("\n").pop().trim(); // Captura a última linha como resposta
                    if (userInput) {
                        this.value += `Você: ${userInput}\n`;
                        // Executa o código Python com a entrada do usuário
                        pyodide.runPython(`nome = '${userInput}'; print(f"Olá, {nome}!")`);

                        // Captura a saída redirecionada após a resposta do usuário
                        result = pyodide.runPython('sys.stdout.getvalue()');
                        this.value += result;
                        this.readonly = true; // Desabilita edição após resposta
                    }
                }
            });
        }

    } catch (error) {
        document.getElementById("terminal").value = "Erro ao executar Python: " + error;
        console.error("Erro:", error);
    } 
}

// Carrega o Pyodide ao carregar a página
window.onload = loadPyodideAndPackages;

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