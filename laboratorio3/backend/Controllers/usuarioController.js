const usuarioModel = require('../Models/usuarioModel');

const getAll = (req, res) => {
    usuarioModel.getAll()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const getById = (req, res) => {
    const id = req.params.id;

    usuarioModel.getById(id)
        .then(data => {
            if (data) return res.status(200).json(data);
            return res.status(404).json("Usuário não encontrado.");
        })
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const getByEmail = (req, res) => {
    const email = req.params.email;

    usuarioModel.getByEmail(email)
        .then(data => {
            if (data) return res.status(200).json(data);
            return res.status(404).json("Usuário não encontrado.");
        })
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const post = (req, res) => {
    const { nome, email, senha } = req.body;
            
        usuarioModel.post(nome, email, senha)
        .then(() => res.status(201).json("Usuário criado com sucesso."))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] || err.message }));
};

const put = (req, res) => {
    const id = req.params.id;
    let { nome, email, senha } = req.body;

    usuarioModel.getById(id)
        .then(data => {
            if (!data) {
                throw new Error("Usuário não encontrado.");
            }

            nome = nome || data.nome;
            email = email || data.email;
            senha = senha || data.senha;

            return usuarioModel.put(id, nome, email, senha);
        })
        .then(() => res.status(200).json("Usuário atualizado com sucesso."))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] || err.message }));
};

const del = (req, res) => {
    const id = req.params.id;

    usuarioModel.del(id)
        .then(() => res.status(200).json("Usuário removido com sucesso."))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

module.exports = {
    getAll,
    getById,
    getByEmail,
    post,
    put,
    del
};