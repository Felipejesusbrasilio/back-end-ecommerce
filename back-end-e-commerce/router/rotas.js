const express = require('express');

const rotas = express.Router(); // Correto aqui

const controller = require('../controller/controller');

rotas.get('/statusConexao', controller.statusCors);
rotas.post('/insertPRODUTOS',controller.insertPRODUTOS);
rotas.get('/getPRODUTOS',controller.getPRODUTOS);
rotas.post('/calcularFRETE',controller.calcularFreteSedex);
rotas.post('/insertUser',controller. insertUsuarios);
rotas.post('/login',controller.loginUser);
rotas.get('/statusUser',controller.statusUser);
rotas.get('/pagamento',controller.mercadopago);

module.exports = rotas;