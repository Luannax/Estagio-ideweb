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

async function runPythonCode() {
    // Carrega Pyodide
    
    let pyodide = await loadPyodide();
    

    // Obtém o código Python
    const pythonCode = codeEditor.getValue();
    
    try {
        // Executa o código Python e captura o resultado
        let result = await pyodide.runPythonAsync(pythonCode);
        

        // Exibe o resultado na página
         document.getElementById("terminal").innerText = result;
    } catch (err) {
         document.getElementById("terminal").innerText = err;
    }
}

// Opcoes adicionais
codeEditor.setOptions({
    fontSize: '14pt',
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
});

// Valor padrao no editor
codeEditor.setValue(defaultCode);


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

