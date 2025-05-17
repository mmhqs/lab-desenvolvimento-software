var express = require('express');
const router = express();

const usuarioController = require('../Controllers/usuarioController');
router.get('/', (req, res) => {
    usuarioController.getAll(req, res);
})

router.post('/', (req, res) => {
    usuarioController.post(req, res);
});

router.put('/:id', (req, res) => {
    usuarioController.put(req, res);
});

router.delete('/:id', (req, res) => {
    usuarioController.del(req, res);
});

router.get('/login', (req, res) => {
    usuarioController.login(req, res);
});

module.exports = router;