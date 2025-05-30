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

const getPerfilByUsuarioId = (req, res) => {
    const id = req.params.id;

    usuarioModel.getPerfilByUsuarioId(id)
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
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
    }

    usuarioModel.getByEmail(email)
        .then(existingUser => {
            if (existingUser) {
                throw new Error("Já existe um usuário com este email.");
            }
            return usuarioModel.post(nome, email, senha);
        })
        .then(insertId => {
            return usuarioModel.getById(insertId);
        })
        .then(novoUsuario => {
            res.status(201).json(novoUsuario);
        })
        .catch(err => {
            if (err.message === "Já existe um usuário com este email.") {
                return res.status(409).json({ error: err.message });
            }
            res.status(500).json({ error: err['sqlMessage'] || err.message });
        });
};

const put = (req, res) => {
    const id = req.params.id;
    let { nome, email, senha } = req.body;

    usuarioModel.getById(id)
        .then(data => {
            if (!data) {
                throw new Error("Usuário não encontrado.");
            }

            if (email && email !== data.email) {
                return usuarioModel.getByEmail(email)
                    .then(existingUser => {
                        if (existingUser) {
                            throw new Error("Já existe um usuário com este email.");
                        }
                        nome = nome || data.nome;
                        email = email || data.email;
                        senha = senha || data.senha;
                        
                        return usuarioModel.put(id, nome, email, senha);
                    });
            } else {
                nome = nome || data.nome;
                email = email || data.email;
                senha = senha || data.senha;
                
                return usuarioModel.put(id, nome, email, senha);
            }
        })
        .then(() => res.status(200).json("Usuário atualizado com sucesso."))
        .catch(err => {
            if (err.message === "Usuário não encontrado.") {
                return res.status(404).json({ error: err.message });
            }
            if (err.message === "Já existe um usuário com este email.") {
                return res.status(409).json({ error: err.message });
            }
            res.status(500).json({ error: err['sqlMessage'] || err.message });
        });
};

const del = (req, res) => {
    const id = req.params.id;

    usuarioModel.del(id)
        .then(() => res.status(200).json("Usuário removido com sucesso."))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    try {
        const usuario = await usuarioModel.getByEmail(email);
        
        if (!usuario) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }
        if (usuario.senha !== senha) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }
        
        const perfil = await usuarioModel.getPerfilByUsuarioId(usuario.id);
        
        if (!perfil) {
            return res.status(404).json({ error: "Perfil não encontrado para este usuário." });
        }
        
        res.status(200).json({
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            },
            tipo: perfil.tipo,
            perfil: perfil.dados
        });
        
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ error: err.message || 'Erro interno do servidor' });
    }
};

module.exports = {
    getAll,
    getById,
    getByEmail,
    post,
    put,
    del,
    login,
    getPerfilByUsuarioId
};