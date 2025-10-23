const express = require('express');
require('dotenv').config()
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 5000;
const rota = require('./router/rotas');

// Configuração do CORS para permitir cookies entre domínios
app.use(cors({
  origin: 'https://front-end-two-ebon.vercel.app/',  // Permite o frontend
  credentials: true,  // Permite o envio de cookies de sessão
}));

// Configuração do cookie-parser (deve vir antes de 'express-session')
app.use(cookieParser('segredo-aqui'));

// Configuração de sessão
app.use(session({
  secret: 'dsfdsfgfdgdfdf',  // Chave secreta para assinar a sessão
  resave: false,  // Não regravar a sessão se não houver mudanças
  saveUninitialized: true,  // Salvar sessões não inicializadas
  cookie: {
    httpOnly: true,  // Não acessível via JavaScript
    secure: false,   // Durante o desenvolvimento, defina como false (para HTTP)
    maxAge: 1000 * 60 * 60 * 24,  // Tempo de expiração da sessão (24 horas)
  },
}));

// Habilitar express.json() e express.urlencoded() para ler o corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota principal
app.use('/api', rota);

// Rota de logout para destruir a sessão
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ msg: 'Erro ao destruir a sessão' });
    }
    res.status(200).json({ msg: 'Sessão destruída com sucesso' });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
