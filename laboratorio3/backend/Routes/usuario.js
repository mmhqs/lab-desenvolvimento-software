var express = require('express');
const router = express();

const usuarioController = require('../Controllers/usuarioController');

router.post('/login', (req, res) => {
    usuarioController.login(req, res);
});

router.get('/', (req, res) => {
    usuarioController.getAll(req, res);
});

router.get('/:id', (req, res) => {
    usuarioController.getById(req, res);
});

router.get('/email/:email', (req, res) => {
    usuarioController.getByEmail(req, res);
});


router.post('/', (req, res) => {
    usuarioController.post(req, res);
});

router.put('/:id', (req, res) => {
    usuarioController.put(req, res);
});

router.delete('/:id', (req, res) => {
    usuarioController.del(req, res);
});

router.get('/teste/:id', (req, res) => {
    usuarioController.getPerfilByUsuarioId(req, res);
});

module.exports = router;