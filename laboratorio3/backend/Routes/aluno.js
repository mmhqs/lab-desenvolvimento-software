const express = require('express');
const router = express.Router(); 

const alunoController = require('../Controllers/alunoController');

router.get('/', (req, res) => {
    alunoController.getAll(req, res);
});

router.get('/:cpf', (req, res) => {
    alunoController.getByCpf(req, res);
});

router.get('/:cpf/saldo', (req, res) => {
    alunoController.getSaldo(req, res);
});

router.get('/:cpf/transacoes', (req, res) => {
    alunoController.getTransacoes(req, res);
});

router.get('/usuario/:usuario_id', (req, res) => {
    alunoController.getByUsuarioId(req, res);
});

router.post('/', (req, res) => {
    alunoController.post(req, res);
});

router.put('/:cpf', (req, res) => {
    alunoController.put(req, res);
});

router.delete('/:cpf', (req, res) => {
    alunoController.del(req, res);
});

router.post('/:cpf/adicionar-moedas', (req, res) => {
    alunoController.adicionarMoedas(req, res);
});

router.post('/:cpf/remover-moedas', (req, res) => {
    alunoController.removerMoedas(req, res);
});

router.post('/resgatar-vantagem/:cpf', (req, res) => {
    alunoController.resgatarVantagem(req, res);
});

router.get('/vantagens-resgatadas/:cpf', (req, res) => {
    alunoController.getVantagensResgatadas(req, res);
});

module.exports = router;