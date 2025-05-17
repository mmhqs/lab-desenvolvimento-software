const alunoModel = require('../Models/alunoModel');

const getAll = (req, res) => {
    alunoModel.getAll()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const getByCpf = (req, res) => {
    const cpf = req.params.cpf;

    alunoModel.getByCpf(cpf)
        .then(data => {
            if (data) { 
                return res.status(200).json(data);
            } else {
                return res.status(404).json({ message: "Aluno não encontrado." });
            }
        })
        .catch(err => {
            console.error('Erro ao buscar aluno por CPF:', err);
            res.status(500).json({ error: err.message || err['sqlMessage'] || 'Erro interno do servidor' });
        });
};

const getByUsuarioId = (req, res) => {
    const usuario_id = req.params.usuario_id;

    alunoModel.getByUsuarioId(usuario_id)
        .then(data => {
            if (data) return res.status(200).json(data);
            return res.status(404).json("Aluno não encontrado para este usuário.");
        })
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const post = (req, res) => {
    const { cpf, usuario_id, rg, endereco, saldo_moedas = 0 } = req.body;

    if (!cpf || !usuario_id || !rg || !endereco) {
        return res.status(400).json({ error: "CPF, ID de usuário, RG e endereço são obrigatórios." });
    }

    alunoModel.cpfExists(cpf)
        .then(exists => {
            if (exists) {
                return res.status(400).json({ error: "CPF já cadastrado." });
            }
            
            return alunoModel.usuarioHasAluno(usuario_id);
        })
        .then(hasAluno => {
            if (hasAluno) {
                return res.status(400).json({ error: "Este usuário já possui cadastro como aluno." });
            }
            
            return alunoModel.post(cpf, usuario_id, rg, endereco, saldo_moedas);
        })
        .then(() => res.status(201).json("Aluno criado com sucesso."))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] || err.message }));
};

const put = (req, res) => {
    const cpf = req.params.cpf;
    const { rg, endereco, saldo_moedas } = req.body;

    alunoModel.getByCpf(cpf)
        .then(data => {
            if (!data) {
                return res.status(404).json({ error: "Aluno não encontrado." });
            }

            const updatedRg = rg !== undefined ? rg : data.rg;
            const updatedEndereco = endereco !== undefined ? endereco : data.endereco;
            const updatedSaldo = saldo_moedas !== undefined ? saldo_moedas : data.saldo_moedas;

            return alunoModel.put(cpf, updatedRg, updatedEndereco, updatedSaldo)
                .then(() => res.status(200).json("Aluno atualizado com sucesso."));
        })
        .catch(err => res.status(500).json({ error: err['sqlMessage'] || err.message }));
};

const del = (req, res) => {
    const cpf = req.params.cpf;

    alunoModel.del(cpf)
        .then(() => res.status(200).json("Aluno removido com sucesso."))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const adicionarMoedas = (req, res) => {
    const cpf = req.params.cpf;
    const { quantidade } = req.body;

    if (quantidade < 0){
        return res.status(400).json({ error: "Quantidade inválida." });
    }

    alunoModel.adicionarMoedas(cpf, quantidade)
        .then(() => res.status(200).json("Moedas adicionadas com sucesso."))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] || err.message }));
};

const removerMoedas = (req, res) => {
    const cpf = req.params.cpf;
    const { quantidade } = req.body;

    if (quantidade < 0) {
        return res.status(400).json({ error: "Quantidade inválida." });
    }

    alunoModel.removerMoedas(cpf, quantidade)
        .then(() => res.status(200).json("Moedas removidas com sucesso."))
        .catch(err => {
            if (err.message.includes('Saldo insuficiente')) {
                return res.status(400).json({ error: err.message });
            }
            res.status(500).json({ error: err['sqlMessage'] || err.message });
        });
};

const resgatarVantagem = (req, res) => {
    const cpf = req.params.cpf;
    const { id_vantagem } = req.body;

    if (!id_vantagem) {
        return res.status(400).json({ error: "ID da vantagem é obrigatório." });
    }

    alunoModel.resgatarVantagem(cpf, id_vantagem)
        .then(result => {
            res.status(200).json({
                message: "Vantagem resgatada com sucesso!",
                novoSaldo: result.novoSaldo,
                registroId: result.registroId
            });
        })
        .catch(err => {
            if (err.message === 'Vantagem não encontrada') {
                return res.status(404).json({ error: err.message });
            }
            if (err.message === 'Aluno não encontrado') {
                return res.status(404).json({ error: err.message });
            }
            if (err.message === 'Saldo insuficiente') {
                return res.status(400).json({ error: err.message });
            }
            console.error('Erro ao resgatar vantagem:', err);
            res.status(500).json({ error: err['sqlMessage'] || 'Erro interno do servidor' });
        });
};

const getVantagensResgatadas = (req, res) => {
    const cpf = req.params.cpf;

    alunoModel.getVantagensResgatadas(cpf)
        .then(data => res.status(200).json(data))
        .catch(err => {
            console.error('Erro ao buscar vantagens resgatadas:', err);
            res.status(500).json({ error: err['sqlMessage'] || 'Erro interno do servidor' });
        });
};

module.exports = {
    getAll,
    getByCpf,
    getByUsuarioId,
    post,
    put,
    del,
    adicionarMoedas,
    removerMoedas,
    resgatarVantagem,
    getVantagensResgatadas
};