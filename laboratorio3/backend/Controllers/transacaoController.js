const transcacaoModel = require('../Models/transcacaoModel');

const getAll = (req, res) => {
    transcacaoModel.getAll()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const getById = (req, res) => {
    const id = req.params.id;

    transcacaoModel.getById(id)
        .then(data => {
            if (data) return res.status(200).json(data);
            return res.status(404).json("Transação não encontrada.");
        })
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const getByRemetente = (req, res) => {
    const remetente_id = req.params.remetente_id;

    transcacaoModel.getByRemetente(remetente_id)
        .then(data => {
            if (data && data.length > 0) return res.status(200).json(data);
            return res.status(404).json("Nenhuma transação encontrada para este remetente.");
        })
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const getByDestinatario = (req, res) => {
    const destinatario_id = req.params.destinatario_id;

    transcacaoModel.getByDestinatario(destinatario_id)
        .then(data => {
            if (data && data.length > 0) return res.status(200).json(data);
            return res.status(404).json("Nenhuma transação encontrada para este destinatário.");
        })
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const getTransacoesEntreUsuarios = (req, res) => {
    const { usuario1_id, usuario2_id } = req.params;

    transcacaoModel.getTransacoesEntreUsuarios(usuario1_id, usuario2_id)
        .then(data => {
            if (data && data.length > 0) return res.status(200).json(data);
            return res.status(404).json("Nenhuma transação encontrada entre estes usuários.");
        })
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const post = (req, res) => {
    const { quantidade_moedas, mensagem, remetente_id, destinatario_id } = req.body;
    
    if (!quantidade_moedas || !remetente_id || !destinatario_id) {
        return res.status(400).json({ 
            error: "Quantidade de moedas, remetente e destinatário são obrigatórios." 
        });
    }

    if (remetente_id === destinatario_id) {
        return res.status(400).json({ 
            error: "Remetente e destinatário não podem ser o mesmo usuário." 
        });
    }

    transcacaoModel.post(null, quantidade_moedas, mensagem || '', remetente_id, destinatario_id)
        .then(insertId => {
            return transcacaoModel.getById(insertId);
        })
        .then(novaTransacao => {
            res.status(201).json(novaTransacao);
        })
        .catch(err => {
            res.status(500).json({ error: err['sqlMessage'] || err.message });
        });
};

const put = (req, res) => {
    const id = req.params.id;
    let { quantidade_moedas, mensagem, remetente_id, destinatario_id } = req.body;

    transcacaoModel.getById(id)
        .then(data => {
            if (!data) {
                throw new Error("Transação não encontrada.");
            }

            quantidade_moedas = quantidade_moedas || data.quantidade_moedas;
            mensagem = mensagem || data.mensagem;
            remetente_id = remetente_id || data.remetente_id;
            destinatario_id = destinatario_id || data.destinatario_id;

            return transcacaoModel.put(id, null, quantidade_moedas, mensagem, remetente_id, destinatario_id);
        })
        .then(() => res.status(200).json("Transação atualizada com sucesso."))
        .catch(err => {
            if (err.message === "Transação não encontrada.") {
                return res.status(404).json({ error: err.message });
            }
            res.status(500).json({ error: err['sqlMessage'] || err.message });
        });
};

const del = (req, res) => {
    const id = req.params.id;

    transcacaoModel.del(id)
        .then(() => res.status(200).json("Transação removida com sucesso."))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

module.exports = {
    getAll,
    getById,
    getByRemetente,
    getByDestinatario,
    getTransacoesEntreUsuarios,
    post,
    put,
    del
};