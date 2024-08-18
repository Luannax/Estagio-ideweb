// Define o pre como o editor da pagina web e altera o tema do editor
document.querySelector('.btn-success').addEventListener('click', runCode2);
let codeEditor = ace.edit("code", {
    mode: "ace/mode/python",
    selectionStyle: "text"
})
let defaultCode = 'print("Hello World!")';
// Tema
//codeEditor.setTheme("ace/theme/one_dark");
// Escolhendo a linguagem
codeEditor.session.setMode("ace/mode/python");


// Opcoes adicionais
codeEditor.setOptions({
            fontSize: '14pt',
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
});

// Valor padrao no editor
 codeEditor.setValue(defaultCode);

 function runCode(){
        // pegando o que esta escrito no editor
        const userCode = codeEditor.getValue();
    
        // tentando mostrar no terminal
        try {
           
           var terminal = document.getElementById("terminal")
           terminal.setValue(userCode)
        } catch (err) {
            console.error(err);
        }
 }

 function runCode1() {
    var code = codeEditor.getValue();

    // faz uma requisição ajax request para o django executar o codigo
    $.ajax({
        type: "POST",
        url: "/Estagio/IDE_Web/Estagio-ideweb/py/django-compiler.py", // caminho do compilador
        headers: {
            'X-CSRFToken': csrftoken 
        },
        data: {
            code: code,
            language: 'python' // fixada em python, posteriomente usar uma variavel
        },
        success: function(data) {
            if (data.result) {
                document.getElementById("terminal").innerText = data.result;
            } else {
                document.getElementById("terminal").innerText = data.error;
            }
        },
        error: function() {
            document.getElementById("terminal").innerText = "Error communicating with the server.";
        }
    });
} 
    function runCode2() {
        
      const code = codeEditor.getValue();
      const language = 'python'; // fixada em python, posteriomente usar uma variavel


      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/Estagio/IDE_Web/Estagio-ideweb/py/django-compiler.py'); // caminho do compilador
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.result) {
            document.getElementById("terminal").innerText = data.result;
          } else if (response.error) {
            document.getElementById("terminal").innerText = data.error;
          } else {
            this.resultContainer.textContent = 'Unknown response.';
          }
        } else {
            document.getElementById("terminal").innerText = "Error communicating with the server.";
        }
      };
      xhr.send('code=${encodeURIComponent(code)}&language=${encodeURIComponent(language)}');
    }
  
  

var csrftoken = getCookie('csrftoken');

        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        // faz a seta Up mover sempre para o começo da linha anterior
        codeEditor.commands.addCommand({
            name: 'moveToPrevLineStart',
            bindKey: {win: 'Up', mac: 'Up'},
            exec: function(editor) {
                const position = editor.getCursorPosition();
                editor.moveCursorTo(position.row - 1, 0);
            },
            readOnly: false
        });
    
        // Faz a seta Down mover sempre para o começo da proxima linha
        codeEditor.commands.addCommand({
            name: 'moveToNextLineStart',
            bindKey: {win: 'Down', mac: 'Down'},
            exec: function(editor) {
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
        bindKey: {win: 'Ctrl-Tab', mac: 'Ctrl-Tab'},
        exec: function() {
            toggleTabNavigation();
        },
        readOnly: false
    });

