//npm install express mysql bcrypt body-parser express-session crypto firebase-admin
// Baixar xamp, sql e mysqlfront
//https://www.mysql.com/downloads/
//https://www.apachefriends.org/pt_br/download.html
//https://mysql-front.softonic.com.br/
//Para rodar o servidor, use o comando: node server_web.js

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
    console.log("Conectado ao MySQL!");
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

        // Inserir configurações padrão na tabela config
        const configQuery = 'INSERT INTO config (user_id, user_name, idioma_id, idioma_nome, voz_id, voz_nome, velocidade) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(configQuery, [result.insertId, nome, 1, "pt-BR", 1, "Google US English", 1], (err) => {
          if (err) {
            console.error("Erro ao inserir configurações padrão:", err);
            return res.json({ STATUS: 'ERROR', MSG: 'Erro ao configurar o usuário.' });
          }

          res.json({ STATUS: 'OK', MSG: 'Usuário registrado com sucesso.' });
        });
      });
    });
  });
});

// Rota de login
app.post("/login", (req, res) => {
  const { matricula, senha } = req.body;

  const sql = "SELECT id, nome, senha FROM usuarios WHERE matricula = ?";
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

            console.log("Sessão após login:", req.session); // Log para verificar a sessão

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

// Rota de logout
app.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Erro ao destruir a sessão:", err);
        return res.status(500).json({ STATUS: "ERROR", MSG: "Erro ao sair." });
      } else {
        res.status(200).json({ STATUS: "OK", MSG: "Logout realizado com sucesso." });
      }
    });
  } else {
    res.status(400).json({ STATUS: "ERROR", MSG: "Nenhuma sessão ativa." });
  }
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

// Buscar configurações do usuário logado
app.get("/getConfiguracoes", (req, res) => {
  console.log("Sessão na rota /getConfiguracoes:", req.session);

  const userId = req.session.userId; // Obtém o ID do usuário logado da sessão

  if (!userId) {
    return res.status(401).json({ STATUS: "ERROR", MSG: "Usuário não autenticado." });
  }

  const sql = `SELECT * FROM config WHERE user_id = ?`;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar configurações:", err);
      return res.status(500).json({ STATUS: "ERROR", MSG: "Erro ao buscar configurações." });
    }

    if (results.length > 0) {
      console.log("Configurações encontradas:", results[0]); // Log para depuração
      res.status(200).json(results[0]); // Retorna as configurações do usuário
    } else {
      res.status(404).json({ STATUS: "ERROR", MSG: "Configurações não encontradas." });
    }
  });
});

// Salvar configurações associadas ao usuário logado
app.post("/salvarConfiguracoes", (req, res) => {
  console.log("Sessão na rota /salvarConfiguracoes:", req.session);
  console.log("Dados recebidos para salvar:", req.body);

  const { languageSelect_id, languageSelect_nome, voiceSelect_id, voiceSelect_nome, velocidade } = req.body;
  const userId = req.session.userId; // Obtém o ID do usuário logado da sessão
  const userName = req.session.userName; // Obtém o nome do usuário logado da sessão

  if (!userId || !userName) {
    return res.status(401).json({ STATUS: "ERROR", MSG: "Usuário não autenticado." });
  }

  // Verificar se o usuário já tem configurações salvas
  const checkSql = `SELECT * FROM config WHERE user_id = ?`;
  db.query(checkSql, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao verificar configurações:", err);
      return res.status(500).json({ STATUS: "ERROR", MSG: "Erro ao verificar configurações." });
    }

    if (results.length > 0) {
      // Atualizar configurações existentes
      const updateSql = `
        UPDATE config 
        SET idioma_id = ?, idioma_nome = ?, voz_id = ?, voz_nome = ?, velocidade = ?
        WHERE user_id = ?
      `;
      db.query(updateSql, [languageSelect_id, languageSelect_nome, voiceSelect_id, voiceSelect_nome, velocidade, userId], (err, result) => {
        if (err) {
          console.error("Erro ao atualizar configurações:", err);
          return res.status(500).json({ STATUS: "ERROR", MSG: "Erro ao atualizar configurações." });
        }
        res.status(200).json({ STATUS: "OK", MSG: "Configurações atualizadas com sucesso." });
      });
    } else {
      // Inserir novas configurações
      const insertSql = `
        INSERT INTO config (user_id, user_name, idioma_id, idioma_nome, voz_id, voz_nome, velocidade) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [userId, userName, languageSelect_id, languageSelect_nome, voiceSelect_id, voiceSelect_nome, velocidade], (err, result) => {
        if (err) {
          console.error("Erro ao salvar configurações:", err);
          return res.status(500).json({ STATUS: "ERROR", MSG: "Erro ao salvar configurações." });
        }
        res.status(200).json({ STATUS: "OK", MSG: "Configurações salvas com sucesso." });
      });
    }
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
