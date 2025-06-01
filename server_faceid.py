#pip install bcrypt
#pip install mysql-connector-python
#pip install flask-cors
#para rodar o servidor, execute: python server_faceid.py

import pickle
import bcrypt
import mysql.connector
import numpy as np
from flask import Flask, jsonify, request, session
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ——— Configurações de sessão ———
# Em produção, defina SECRET_KEY via ENV VAR
app.secret_key = b'sua_chave_super_secreta_aqui'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# ——— Conexão MySQL ———
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        port=3325,          # porta do seu MariaDB
        user="root",
        password="",        # ajuste se tiver senha
        database="ideweb",
        autocommit=True
    )

# ——— Rota de cadastro / atualização de usuário ———
@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    dados = request.get_json()
    nome      = dados.get('nome', '').strip()
    email     = dados.get('email', '').strip()
    matricula = dados.get('matricula', '').strip()
    senha     = dados.get('senha', '').encode('utf-8')

    if not all([nome, email, matricula, senha]):
        return jsonify({ 'STATUS':'ERROR','MSG':'Todos os campos são obrigatórios.' })

    conn = get_db_connection()
    cur  = conn.cursor(dictionary=True)

    # Verifica duplicidade de email ou matrícula
    cur.execute("SELECT Id FROM usuarios WHERE email=%s OR matricula=%s", (email, matricula))
    if cur.fetchone():
        cur.close()
        conn.close()
        return jsonify({ 'STATUS':'ERROR','MSG':'E-mail ou matrícula já cadastrados.' })

    # Hash da senha
    hash_senha = bcrypt.hashpw(senha, bcrypt.gensalt(10))

    # Insere novo usuário
    sql = """INSERT INTO usuarios (matricula, senha, nome, email)
             VALUES (%s, %s, %s, %s)"""
    cur.execute(sql, (matricula, hash_senha.decode('utf-8'), nome, email))
    cur.close()
    conn.close()

    return jsonify({ 'STATUS':'OK','MSG':'Usuário registrado com sucesso.' })


# ——— Rota de login tradicional ———
@app.route('/login', methods=['POST'])
def login():
    dados = request.get_json()
    matricula = dados.get('matricula','').strip()
    senha      = dados.get('senha','').encode('utf-8')

    if not matricula or not senha:
        return jsonify({ 'ERRO':1,'MSG':'Preencha matrícula e senha.' })

    conn = get_db_connection()
    cur  = conn.cursor(dictionary=True)

    cur.execute("SELECT Id, nome, senha FROM usuarios WHERE matricula=%s", (matricula,))
    usuário = cur.fetchone()
    cur.close()
    conn.close()

    if not usuário or not bcrypt.checkpw(senha, usuário['senha'].encode('utf-8')):
        return jsonify({ 'ERRO':1,'MSG':'Credenciais inválidas!' })

    # grava sessão
    session['userId']   = usuário['Id']
    session['userName'] = usuário['nome']

    return jsonify({
        'ERRO':0,
        'ID': usuário['Id'],
        'NOME': usuário['nome'],
        'MSG':'Login bem-sucedido!'
    })


@app.route('/cadastrar_descriptor', methods=['POST'])
def cadastrar_descriptor():
    dados      = request.get_json()
    nome       = dados.get('nome','').strip()
    descriptor = np.array(dados.get('descriptor', []))

    if not nome or descriptor.size == 0:
        return jsonify({'sucesso': False, 'mensagem': 'Nome e descriptor obrigatórios.'})

    blob = pickle.dumps(descriptor)
    conn = get_db_connection()
    cur  = conn.cursor()

    # Tentar atualizar — se rowcount == 0, insere novo registro
    cur.execute("""
      UPDATE usuarios
         SET face_encoding = %s
       WHERE nome = %s
    """, (blob, nome))

    if cur.rowcount == 0:
        # caso não tenha usuário com esse nome, então add
        cur.execute("""
          INSERT INTO usuarios (nome, face_encoding)
               VALUES (%s, %s)
        """, (nome, blob))
        mensagem = f'Usuário {nome} cadastrado com Face ID.'
    else:
        mensagem = f'Face ID atualizado para {nome}.'

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'sucesso': True, 'mensagem': mensagem})



# ——— Rota para validar descriptor (login por Face ID) ———
@app.route('/validar_descriptor', methods=['POST'])
def validar_descriptor():
    dados      = request.get_json()
    descriptor = np.array(dados.get('descriptor', []))
    if descriptor.size == 0:
        return jsonify({'loginSucesso':False,'mensagem':'Descriptor vazio.'})

    conn = get_db_connection()
    cur  = conn.cursor()
    cur.execute("SELECT nome, face_encoding FROM usuarios WHERE face_encoding IS NOT NULL")
    candidatos = cur.fetchall()
    conn.close()

    for nome, blob in candidatos:
        encoding = pickle.loads(blob)
        distancia = np.linalg.norm(encoding - descriptor)
        if distancia < 0.4:
            # sucesso
            session['userName'] = nome
            return jsonify({'loginSucesso':True,'nome':nome})

    return jsonify({'loginSucesso':False})


# ——— Rota para checar usuário logado ———
@app.route('/usuarioLogado', methods=['GET'])
def usuario_logado():
    if 'userId' in session:
        return jsonify({
            'userId': session['userId'],
            'userName': session['userName']
        }), 200
    return jsonify({'STATUS':'ERROR','MSG':'Usuário não autenticado'}), 401


# ——— Rota raiz ———
@app.route('/', methods=['GET'])
def index():
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(port=5000, debug=True)
