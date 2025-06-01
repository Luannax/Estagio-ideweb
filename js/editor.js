let nivelUsuario = "iniciante";

let codeEditor = ace.edit("code", {
    mode: "ace/mode/python",
    selectionStyle: "text"
});
let defaultCode = '# Pressione Shift-Tab para ativar/desativar Tab\nprint("Hello World!")';
codeEditor.session.setMode("ace/mode/python");
codeEditor.setValue(defaultCode);

let pyodide;
let pyodideReadyPromise;
let namespace;

// Carregar Pyodide
async function loadPyodideAndPackages() {
    pyodideReadyPromise = await loadPyodide();
    pyodide = pyodideReadyPromise;
    namespace = pyodide.globals.get("dict")();

    pyodide.registerJsModule("jsinput", {
        async input(prompt_text) {
            return await getUserInput(prompt_text);
        }
    });

    console.log("Pyodide carregado com sucesso.");
}

// Função de input assíncrono
function getUserInput(promptText) {
    return new Promise((resolve) => {
        const terminal = document.getElementById("terminal");
        terminal.readOnly = false;
        terminal.value += promptText + "\n";
        terminal.focus();
        terminal.placeholder = "Digite sua resposta e pressione Enter...";

        const handler = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const lines = terminal.value.split('\n');
                const input = lines[lines.length - 1].trim();
                terminal.removeEventListener('keydown', handler);
                terminal.readOnly = true;
                resolve(input);
            }
        };

        terminal.addEventListener('keydown', handler);
    });
}

// Função que insere `await` antes de `input()` automaticamente
function autoAwaitInputs(code) {
    // Garante que apenas chamadas a `input()` sejam alteradas, sem afetar outras palavras ou métodos
    return code.replace(/(?<!\bawait\s)(?<!\.)\binput\s*\(/g, 'await input(');
}

// Função principal de execução do código
async function runPythonCode() {
    const terminal = document.getElementById("terminal");
    terminal.value = "";

    const codeRaw = codeEditor.getValue();
    const code = autoAwaitInputs(codeRaw); // 🔄 Adiciona await aos input()

    try {
        await pyodide.runPythonAsync(`
import sys
from io import StringIO
import builtins
from jsinput import input as js_input

sys.stdout = sys.stderr = StringIO()

async def input(prompt=""):
    return await js_input(prompt)

builtins.input = input
`, { globals: namespace });

        // Encapsula o código do usuário dentro de uma função async
        const wrappedCode = `
async def __main__():
${code.split('\n').map(line => '    ' + line).join('\n')}

await __main__()`;

        await pyodide.runPythonAsync(wrappedCode, { globals: namespace });

        const output = await pyodide.runPythonAsync("sys.stdout.getvalue()", { globals: namespace });
        terminal.value += output;
    } catch (error) {
        console.error(error);
        terminal.value += "\nErro: " + error;
    }

    terminal.readOnly = true;
}

document.querySelector('.btn-success').addEventListener('click', runPythonCode);

window.onload = loadPyodideAndPackages;

// Configurações do editor
codeEditor.setOptions({
    fontSize: '14pt',
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true
});
codeEditor.getSession().setTabSize(4);
codeEditor.getSession().setUseSoftTabs(true);

// Comandos personalizados de navegação no editor
codeEditor.commands.addCommand({
    name: 'moveToPrevLineStart',
    bindKey: { win: 'Up', mac: 'Up' },
    exec: function (editor) {
        const position = editor.getCursorPosition();
        editor.moveCursorTo(position.row - 1, 0);
    },
    readOnly: false
});

codeEditor.commands.addCommand({
    name: 'moveToNextLineStart',
    bindKey: { win: 'Down', mac: 'Down' },
    exec: function (editor) {
        const position = editor.getCursorPosition();
        editor.moveCursorTo(position.row + 1, 0);
    },
    readOnly: false
});

// Alternar Tab com Shift-Tab
let tabNavigationEnabled = true;
function toggleTabNavigation() {
    if (tabNavigationEnabled) {
        disableTab();
    } else {
        enableTab();
    }
    tabNavigationEnabled = !tabNavigationEnabled;
}

function disableTab() {
    codeEditor.commands.bindKey("Tab", null);
    codeEditor.commands.bindKey("Shift-Tab", null);
}

function enableTab() {
    codeEditor.commands.bindKey("Tab", "insertTab");
    codeEditor.commands.bindKey("Shift-Tab", "outdent");
}

codeEditor.commands.addCommand({
    name: 'toggleTabNavigation',
    bindKey: { win: 'Shift-Tab', mac: 'Shift-Tab' },
    exec: function () {
        toggleTabNavigation();
    },
    readOnly: false
});

// Sugestões de código para iniciantes
codeEditor.on("input", function () {
    if (nivelUsuario !== "iniciante") return;

    ace.require("ace/ext/language_tools").setCompleters([]);
    ace.require("ace/ext/language_tools").addCompleter(customCompleter);

    setTimeout(() => {
        const cursor = codeEditor.getCursorPosition();
        const line = codeEditor.session.getLine(cursor.row);
        const prefix = line.substring(0, cursor.column);
        const letra = prefix.trim().toLowerCase();

        if (letra.length === 1 && /^[a-zA-Z]$/.test(letra)) {
            if (comandosPythonIniciante[letra]) {
                const sugestoes = comandosPythonIniciante[letra].join(", ");
                speak(`Sugestões para letra ${letra}: ${sugestoes}`);
            }
        }
    }, 0);
});

// Fala as sugestões
function speak(texto) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = 'pt-BR';
    synth.cancel();
    synth.speak(utter);
}

// Comandos Python para sugestões
const comandosPythonIniciante = {
    a: ["abs()", "all()", "any()", "append()"],
    b: ["break", "bool()"],
    c: ["continue", "class", "count()"],
    d: ["def", "del", "dict()", "divmod()"],
    e: ["else", "elif", "enumerate()"],
    f: ["for", "float()", "from"],
    i: ["if", "input()", "int()"],
    p: ["print()", "pop()", "pass"],
    r: ["range()", "return"],
    s: ["str()", "sum()", "split()"],
    w: ["while", "with"]
};

// Completador customizado
const customCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
        if (prefix.length === 1) {
            const letra = prefix.toLowerCase();
            const comandos = comandosPythonIniciante[letra] || [];
            const completions = comandos.map(cmd => ({
                caption: cmd,
                value: cmd,
                meta: "iniciante"
            }));
            callback(null, completions);
        } else {
            callback(null, []);
        }
    }
};
