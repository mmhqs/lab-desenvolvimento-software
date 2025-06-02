var express = require('express');
const router = express.Router();

const transcacaoController = require('../Controllers/transacaoController');

router.get('/', (req, res) => {
    transcacaoController.getAll(req, res);
});

router.get('/:id', (req, res) => {
    transcacaoController.getById(req, res);
});

router.post('/', (req, res) => {
    transcacaoController.post(req, res);
});

router.put('/:id', (req, res) => {
    transcacaoController.put(req, res);
});

router.delete('/:id', (req, res) => {
    transcacaoController.del(req, res);
});

router.get('/remetente/:remetente_id', (req, res) => {
    transcacaoController.getByRemetente(req, res);
});

router.get('/destinatario/:destinatario_id', (req, res) => {
    transcacaoController.getByDestinatario(req, res);
});

router.get('/entre/:usuario1_id/:usuario2_id', (req, res) => {
    transcacaoController.getTransacoesEntreUsuarios(req, res);
});

module.exports = router;