const express = require('express');
const router = express.Router();

const professorController = require('../Controllers/professorController');

router.get('/', (req, res) => {
    professorController.getAll(req, res);
});

router.get('/:cpf', (req, res) => {
    professorController.getByCpf(req, res);
});

router.post('/', (req, res) => {
    professorController.post(req, res);
});

router.put('/:cpf', (req, res) => {
    professorController.put(req, res);
});

router.delete('/:cpf', (req, res) => {
    professorController.del(req, res);
});

router.get('/usuario/:usuario_id', (req, res) => {
    professorController.getByUsuarioId(req, res);
});

router.post('/enviar-moedas', (req, res) => {
    professorController.enviarMoedas(req, res);
});

module.exports = router;