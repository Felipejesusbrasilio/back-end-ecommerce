const conexao = require('../conexao/mysql');
const mercadopago = require('mercadopago');

class Endpoint {
  // Função para verificar se o CORS está funcionando
  statusCors(req, res) {
    res.status(200).json({ msg: 'Funcionando com sucesso o CORS' });
  }

  // Função para inserir um novo produto no banco
  insertPRODUTOS(req, res) {
    const { nome, valor, img, p, m, g, gg } = req.body;

    const sql = 'INSERT INTO produtos_index (nome, valor, imagem, tamanhoOne, tamanhoTwo, tamanhoThree, tamanhoFor) VALUES (?, ?, ?, ?, ?, ?, ?)';

    conexao.query(sql, [nome, valor, img, p, m, g, gg], (erro, resultado) => {
      if (erro) {
        return res.status(500).json({ erro: 'Erro ao inserir produto', detalhes: erro });
      }
      res.status(201).json({ mensagem: 'Produto inserido com sucesso', id: resultado.insertId });
    });
  }

  // Função para pegar todos os produtos
  getPRODUTOS(req, res) {
    conexao.query('SELECT * FROM produtos_index', (error, result) => {
      if (error) {
        return res.status(500).json({ msg: 'Erro ao selecionar os produtos', detalhes: error });
      }
      return res.status(200).json({
        msg: 'Consulta feita com sucesso',
        produtos: result // Retorna o resultado da consulta (produtos)
      });
    });
  }

  // Função de cálculo de frete usando a nova versão da biblioteca node-correios
  calcularFreteSedex(req, res) {  
    console.log('funcionando')
  }

  insertUsuarios(req, res) {
    const { nome, email, endereco, numero, cidade, estado, senha } = req.body;

    conexao.query(
      'INSERT INTO usuarios (nome, email, endereco, numero, cidade, estado, senha) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [nome, email, endereco, numero, cidade, estado, senha], 
      (error, result) => {
        if (error) {
          return res.status(500).json({ msg: 'Erro ao fazer a inserção' });
        }

        res.status(200).json({ msg: 'Usuário cadastrado com sucesso' });
      }
    );
  }

  loginUser(req, res) {
  const { email, senha } = req.body;

  conexao.query('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha], (error, result) => {
    if (error) {
      return res.status(500).json({ msg: 'Erro ao fazer a consulta do usuário' });
    }

    if (result.length === 0) {
      return res.status(401).json({ msg: 'Usuário ou senha incorretos' });
    }
     
    req.session.user = {email:email}
     
    res.status(200).json({ msg: 'Consulta feita com sucesso', email: email });

    console.log(req.session.user);

  });
}

  statusUser(req, res) {
  const user = req.session.user;  // Corrigindo o erro de digitação aqui

  if (user) {
    console.log(user);
    res.status(200).json({ msg: 'Usuário logado', user });
  } else {
    console.log('Não existe session criada');
    res.status(401).json({ msg: 'Usuário não está logado' });
  }
}


mercadopago(req,res)
{
  // Configuração do Mercado Pago com seu access_token (obtenha no painel de desenvolvedor)
mercadopago.configurations.setAccessToken(process.env.TOKEN);

// Criação da preferência de pagamento com Pix e Boleto
const preference = {
  items: [
    {
      title: 'Preto luxo',
      quantity: 1,
      currency_id: 'BRL',
      unit_price: 100.00, // Preço do produto
    },
  ],
  back_urls: {
    success: 'https://www.suapagina.com/success',
    failure: 'https://www.suapagina.com/failure',
    pending: 'https://www.suapagina.com/pending',
  },
  auto_return: 'approved',
  payment_methods: {
    included_payment_methods: [
      { id: 'pix' },  // Inclui o Pix
      { id: 'ticket' },  // Inclui o Boleto
    ],
    excluded_payment_methods: [
      { id: 'credit_card' }  // Exclui o Cartão de Crédito
    ],
  },
};

// Criar a preferência no Mercado Pago
mercadopago.preferences.create(preference).then(function(response) {
  const preferenceId = response.body.id;
  console.log("ID da Preferência para Pix e Boleto: " + preferenceId);
  const paymentLink = response.body.init_point;
  console.log("Link de pagamento (Pix ou Boleto): " + paymentLink);
  res.status(200).json({
    msg: 'Funcionando com sucesso',
    link: paymentLink
  });
}).catch(function(error) {
  console.log("Erro ao criar a preferência: ", error);
});

}



}

module.exports = new Endpoint();