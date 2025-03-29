//npm install express mysql bcrypt body-parser express-session crypto
// Baixar xamp, sql e mysqlfront
//https://www.mysql.com/downloads/
//https://www.apachefriends.org/pt_br/download.html
//https://mysql-front.softonic.com.br/

const express = require("express"); //FRAMEWORK WEB
const mysql = require("mysql"); //CONECTAR COM O BANCO DE DADOS
const bcrypt = require("bcrypt"); //CRIPTOGRAFAR SENHA
const bodyParser = require("body-parser"); //PARSEAR O CORPO DA REQUISIÇÃO
const path = require("path"); //CAMINHO DOS ARQUIVOS
const session = require('express-session'); // Middleware para sessão
const crypto = require('crypto'); // Para gerar chave secreta

const app = express(); // Inicializar o express antes de usar qualquer configuração

// Gera uma chave secreta de 64 bytes para a sessão
const secretKey = crypto.randomBytes(64).toString('hex');

// Configuração do middleware de sessão
app.use(session({
  secret: secretKey, // Chave gerada aleatoriamente
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // DIRETÓRIO RAIZ

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ideweb", // NOME DO BANCO DE DADOS
  port: 3325, // PORTA DO MYSQL
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
  } else {
    console.log("Conectado ao MySQL! Na porta 3307");
  }
});

// Rota de cadastro
app.post('/cadastrar', (req, res) => {
  const { nome, email, matricula, senha } = req.body;

  if (!nome || !email || !matricula || !senha) {
    return res.json({ STATUS: 'ERROR', MSG: 'Todos os campos são obrigatórios.' });
  }

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.json({ STATUS: 'ERROR', MSG: 'Erro ao verificar o e-mail.' });
    }

    if (results.length > 0) {
      return res.json({ STATUS: 'ERROR', MSG: 'Este e-mail já está cadastrado.' });
    }

    bcrypt.hash(senha, 10, (err, hash) => {
      if (err) {
        return res.json({ STATUS: 'ERROR', MSG: 'Erro ao criptografar a senha.' });
      }

      const query = 'INSERT INTO usuarios (matricula, senha, nome, email) VALUES (?, ?, ?, ?)';
      db.query(query, [matricula, hash, nome, email], (err, result) => {
        if (err) {
          return res.json({ STATUS: 'ERROR', MSG: 'Erro ao cadastrar o usuário.' });
        }

        res.json({ STATUS: 'OK', MSG: 'Usuário registrado com sucesso.' });
      });
    });
  });
});

// Rota de login
app.post("/login", (req, res) => {
  const { matricula, senha } = req.body;

  const sql = "SELECT * FROM usuarios WHERE matricula = ?";
  db.query(sql, [matricula], (err, result) => {
    if (err) {
      res.status(500).send("Erro ao verificar login");
    } else {
      if (result.length > 0) {
        bcrypt.compare(senha, result[0].senha, (err, isMatch) => {
          if (isMatch) {
            // Armazenar o ID e o Nome do Usuário na sessão
            req.session.userId = result[0].id;
            req.session.userName = result[0].nome;

            res.status(200).json({
              ERRO: 0,
              ID: result[0].id,
              NOME: result[0].nome,
              MSG: "Login bem-sucedido!",
            });
          } else {
            res.status(200).json({ ERRO: 1, MSG: "Credenciais inválidas!" });
          }
        });
      } else {
        res.status(200).json({ ERRO: 1, MSG: "Credenciais inválidas!" });
      }
    }
  });
});

// Obter idiomas
app.get("/getIdiomas", (req, res) => {
  const sql = "SELECT id, nome FROM idiomas ORDER BY nome";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ STATUS: "ERROR", MSG: "Erro ao buscar idiomas." });
    } else {
      res.status(200).json(results);
    }
  });
});

// Obter vozes
app.get("/getVozes", (req, res) => {
  const sql = "SELECT id, nome FROM voz ORDER BY nome";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ STATUS: "ERROR", MSG: "Erro ao buscar vozes." });
    } else {
      res.status(200).json(results);
    }
  });
});

// Salvar configurações
app.post("/salvarConfiguracoes", (req, res) => {
  const { iniciar_leitor, languageSelect_id, languageSelect_nome, voiceSelect_id, voiceSelect_nome, velocidade } = req.body;

  const sql = `INSERT INTO config (iniciar_leitor, idioma_id, idioma_nome, voz_id, voz_nome, velocidade) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [iniciar_leitor, languageSelect_id, languageSelect_nome, voiceSelect_id, voiceSelect_nome, velocidade], (err, result) => {
    if (err) {
      console.error("Erro ao salvar configuração:", err);
      return res.status(500).json({ STATUS: "ERROR", MSG: "Erro ao salvar configurações." });
    }
    res.status(200).json({ STATUS: "OK", MSG: "Configurações salvas com sucesso." });
  });
});

// Verificar usuário logado
app.get("/usuarioLogado", (req, res) => {
  if (req.session.userId) {
    res.status(200).json({
      userId: req.session.userId,
      userName: req.session.userName
    });
  } else {
    res.status(401).json({ STATUS: "ERROR", MSG: "Usuário não autenticado" });
  }
});

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Iniciar o servidor
app.listen(3090, (err) => {
  if (err) {
    console.error("Erro ao iniciar o servidor:", err);
  } else {
    console.log("Servidor rodando na porta 3090 = http://localhost:3090");
  }
});
