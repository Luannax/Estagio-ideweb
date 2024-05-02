// Define o pre como o editor da pagina web e altera o tema do editor
document.querySelector('.btn-success').addEventListener('click', runCode);
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

