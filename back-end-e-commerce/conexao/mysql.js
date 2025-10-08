const mysql = require('mysql2');
require('dotenv').config();

const conexao = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

conexao.connect((erro) => {
  if (erro) {
    console.error('Erro ao conectar ao MySQL:', erro.message);
  } else {
    console.log('Conexão com MySQL estabelecida com sucesso!');
  }
});

module.exports = conexao;