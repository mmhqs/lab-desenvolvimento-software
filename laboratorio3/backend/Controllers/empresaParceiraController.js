const empresaParceiraModel = require('../Models/empresaParceiraModel');

const getAll = (req, res) => {
    empresaParceiraModel.getAll()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const getByCnpj = (req, res) => {
    const cnpj = req.params.cnpj;

    empresaParceiraModel.getByCnpj(cnpj)
        .then(data => {
            if (data) return res.status(200).json(data);
            return res.status(404).json("Empresa parceira não encontrada.");
        })
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const getByUsuarioId = (req, res) => {
    const usuario_id = req.params.usuario_id;

    empresaParceiraModel.getByUsuarioId(usuario_id)
        .then(data => {
            if (data) return res.status(200).json(data);
            return res.status(404).json("Empresa parceira não encontrada para este usuário.");
        })
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const post = (req, res) => {
    const { cnpj, usuario_id } = req.body;
            
    empresaParceiraModel.post(cnpj, usuario_id)
        .then(() => res.status(201).json("Empresa parceira criada com sucesso."))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] || err.message }));
};

const put = (req, res) => {
    const cnpj = req.params.cnpj;
    let { usuario_id } = req.body;

    empresaParceiraModel.getByCnpj(cnpj)
        .then(data => {
            if (!data) {
                throw new Error("Empresa parceira não encontrada.");
            }

            usuario_id = usuario_id || data.usuario_id;

            return empresaParceiraModel.put(cnpj, usuario_id);
        })
        .then(() => res.status(200).json("Empresa parceira atualizada com sucesso."))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] || err.message }));
};

const del = (req, res) => {
    const cnpj = req.params.cnpj;

    empresaParceiraModel.del(cnpj)
        .then(() => res.status(200).json("Empresa parceira removida com sucesso."))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const addVantagem = (req, res) => {
    const empresa_cnpj = req.params.cnpj;
    const vantagemData = req.body;

    empresaParceiraModel.addVantagem(empresa_cnpj, vantagemData)
        .then(() => res.status(201).json("Vantagem adicionada com sucesso."))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] || err.message }));
};

const removeVantagem = (req, res) => {
    const vantagem_id = req.params.vantagem_id;

    empresaParceiraModel.removeVantagem(vantagem_id)
        .then(success => {
            if (success) return res.status(200).json("Vantagem removida com sucesso.");
            return res.status(404).json("Vantagem não encontrada.");
        })
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

module.exports = {
    getAll,
    getByCnpj,
    getByUsuarioId,
    post,
    put,
    del,
    addVantagem,
    removeVantagem
};