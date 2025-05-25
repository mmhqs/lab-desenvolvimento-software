const express = require('express');
const router = express.Router(); 

const empresaParceiraController = require('../Controllers/empresaParceiraController');

router.get('/', (req, res) => {
    empresaParceiraController.getAll(req, res);
});

router.get('/:cnpj', (req, res) => {
    empresaParceiraController.getByCnpj(req, res);
});

router.get('/vantagens/todas', (req, res) => {
    empresaParceiraController.getAllVantagens(req, res);
});

router.get('/usuario/:usuario_id', (req, res) => {
    empresaParceiraController.getByUsuarioId(req, res);
});

router.post('/', (req, res) => {
    empresaParceiraController.post(req, res);
});

router.put('/:cnpj', (req, res) => {
    empresaParceiraController.put(req, res);
});

router.delete('/:cnpj', (req, res) => {
    empresaParceiraController.del(req, res);
});

router.post('/vantagens/:cnpj', (req, res) => {
    empresaParceiraController.addVantagem(req, res);
});

router.delete('/vantagens/:vantagem_id', (req, res) => {
    empresaParceiraController.removeVantagem(req, res);
});

router.put('/vantagens/:vantagem_id', (req, res) => {
    empresaParceiraController.updateVantagem(req, res);
});

module.exports = router;