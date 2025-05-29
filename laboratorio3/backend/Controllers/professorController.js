const professorModel = require('../Models/professorModel');
const usuarioModel = require('../Models/usuarioModel');
const alunoModel = require('../Models/alunoModel');

// Controller básico CRUD para Professor
const getAll = (req, res) => {
    professorModel.getAll()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const getByCpf = (req, res) => {
    const cpf = req.params.cpf;

    professorModel.getByCpf(cpf)
        .then(data => {
            if (data) return res.status(200).json(data);
            return res.status(404).json("Professor não encontrado.");
        })
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const getByUsuarioId = (req, res) => {
    const usuario_id = req.params.usuario_id;

    professorModel.getByUsuarioId(usuario_id)
        .then(data => {
            if (data) return res.status(200).json(data);
            return res.status(404).json("Professor não encontrado.");
        })
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const post = (req, res) => {
    // Aceita ambos saldo_moedas (do JSON) e saldoMoedas (do código)
    const { cpf, departamento, saldo_moedas, saldoMoedas, usuario_id } = req.body;
    const saldo = saldoMoedas !== undefined ? saldoMoedas : saldo_moedas;
    
    if (!cpf || !departamento || saldo === undefined || !usuario_id) {
        return res.status(400).json({ error: "CPF, departamento, saldoMoedas e usuario_id são obrigatórios." });
    }

    professorModel.cpfExists(cpf)
        .then(exists => {
            if (exists) {
                throw new Error("Já existe um professor com este CPF.");
            }
            return professorModel.post(cpf, departamento, saldo, usuario_id);
        })
        .then(() => {
            return professorModel.getByCpf(cpf);
        })
        .then(novoProfessor => {
            res.status(201).json(novoProfessor);
        })
        .catch(err => {
            if (err.message === "Já existe um professor com este CPF.") {
                return res.status(409).json({ error: err.message });
            }
            res.status(500).json({ error: err['sqlMessage'] || err.message });
        });
};

const put = async (req, res) => {
    try {
        const cpfAtual = req.params.cpf;
        const { cpf: novoCpf, departamento, saldo_moedas, saldoMoedas } = req.body;
        
        // Verifica se o professor existe
        const professor = await professorModel.getByCpf(cpfAtual);
        if (!professor) {
            return res.status(404).json({ error: "Professor não encontrado." });
        }

        // Se tentar alterar o CPF, verifica se o novo já existe
        if (novoCpf && novoCpf !== cpfAtual) {
            const cpfExistente = await professorModel.cpfExists(novoCpf);
            if (cpfExistente) {
                return res.status(409).json({ error: "Já existe um professor com este CPF." });
            }
        }

        // Prepara os dados para atualização
        const dadosAtualizacao = {
            cpf: novoCpf,
            departamento: departamento || professor.departamento,
            saldo_moedas: saldo_moedas || saldoMoedas || professor.saldo_moedas
        };

        // Executa a atualização
        const atualizado = await professorModel.put(cpfAtual, dadosAtualizacao);
        if (!atualizado) {
            return res.status(500).json({ error: "Falha ao atualizar professor." });
        }

        // Retorna o professor atualizado
        const professorAtualizado = await professorModel.getByCpf(novoCpf || cpfAtual);
        res.status(200).json(professorAtualizado);

    } catch (err) {
        console.error('Erro ao atualizar professor:', err);
        res.status(500).json({ error: err.message || "Erro interno do servidor." });
    }
};
const del = (req, res) => {
    const cpf = req.params.cpf;

    professorModel.del(cpf)
        .then(() => res.status(200).json("Professor removido com sucesso."))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const enviarMoedas = async (req, res) => {
    const { professor_id, aluno_id, quantidade, motivo } = req.body;

    if (!professor_id || !aluno_id || !quantidade || quantidade <= 0) {
        return res.status(400).json({ 
            error: "Professor ID, Aluno ID e uma quantidade positiva de moedas são obrigatórios." 
        });
    }

    try {
        const [professor, aluno] = await Promise.all([
            professorModel.getById(professor_id),
            alunoModel.getById(aluno_id)
        ]);

        if (!professor) {
            return res.status(404).json({ error: "Professor não encontrado." });
        }
        if (!aluno) {
            return res.status(404).json({ error: "Aluno não encontrado." });
        }

        if (professor.saldoMoedas < quantidade) {
            return res.status(400).json({ 
                error: "Saldo de moedas insuficiente para realizar a transferência." 
            });
        }

        await Promise.all([
            professorModel.updateSaldoMoedas(professor_id, professor.saldoMoedas - quantidade),
            alunoModel.updateSaldoMoedas(aluno_id, aluno.saldoMoedas + quantidade)
        ]);

        res.status(200).json({ 
            message: "Moedas transferidas com sucesso.",
            saldoProfessor: professor.saldoMoedas - quantidade,
            saldoAluno: aluno.saldoMoedas + quantidade
        });

    } catch (err) {
        console.error('Erro ao enviar moedas:', err);
        res.status(500).json({ error: err['sqlMessage'] || err.message });
    }
};

module.exports = {
    getAll,
    getByCpf,
    getByUsuarioId,
    post,
    put,
    del,
    enviarMoedas
};