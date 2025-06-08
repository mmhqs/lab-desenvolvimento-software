const professorModel = require('../Models/professorModel');
const usuarioModel = require('../Models/usuarioModel');
const alunoModel = require('../Models/alunoModel');
const email = require('../middlewares/email');

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

        const professor = await professorModel.getByCpf(cpfAtual);
        if (!professor) {
            return res.status(404).json({ error: "Professor não encontrado." });
        }

        if (novoCpf && novoCpf !== cpfAtual) {
            const cpfExistente = await professorModel.cpfExists(novoCpf);
            if (cpfExistente) {
                return res.status(409).json({ error: "Já existe um professor com este CPF." });
            }
        }

        const dadosAtualizacao = {
            cpf: novoCpf,
            departamento: departamento || professor.departamento,
            saldo_moedas: saldo_moedas || saldoMoedas || professor.saldo_moedas
        };

        const atualizado = await professorModel.put(cpfAtual, dadosAtualizacao);
        if (!atualizado) {
            return res.status(500).json({ error: "Falha ao atualizar professor." });
        }

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
    const resultado = await professorModel.enviarMoedas(professor_id, aluno_id, quantidade, motivo);
    
    try {
        const [professor, aluno] = await Promise.all([
            professorModel.getByUsuarioId(professor_id),
            alunoModel.getByUsuarioId(aluno_id)
        ]);


        if (!professor || !aluno) {
            return res.status(404).json({ error: "Professor ou aluno não encontrado." });
        }

        const assunto = `Você recebeu ${quantidade} moeda(s)!`;
        const corpo = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1a73e8; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🎉 Moedas Recebidas!</h1>
        </div>
        
        <div style="padding: 25px;">
            <p style="font-size: 16px;">Olá, <strong>${aluno.nome}</strong>!</p>
            
            <div style="background-color: #e8f0fe; border-left: 4px solid #1a73e8; padding: 12px; margin: 15px 0; border-radius: 0 4px 4px 0;">
                <p style="margin: 0; color: #1a73e8; font-weight: bold;">
                    Você recebeu <span style="font-size: 18px;">${quantidade} moeda(s)</span> do professor ${professor.nome}!
                </p>
            </div>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Motivo:</strong></p>
                <p style="margin: 5px 0 0 0;">${motivo || "Transferência de moedas"}</p>
            </div>
            
            <p style="font-size: 15px;">Aproveite suas moedas e continue com o excelente trabalho!</p>
            
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #70757a; border-top: 1px solid #e0e0e0;">
            <p style="margin: 0;">Sistema de Moedas Acadêmicas</p>
        </div>
    </div>
`;

        await email.enviarEmail(aluno.email, assunto, corpo);

        res.status(200).json({
            message: "Moedas enviadas com sucesso e e-mail disparado!",
            detalhes: resultado
        });

    } catch (err) {
        res.status(500).json({ error: "Erro ao processar: " + err.message });
    }
};

const adicionarMoedas = async (req, res) => {
    try {
        const { professor_id, quantidade } = req.body;

        if (!professor_id || !quantidade || quantidade <= 0) {
            return res.status(400).json({ 
                error: "ID do professor e uma quantidade positiva de moedas são obrigatórios." 
            });
        }

        const resultado = await professorModel.adicionarMoedas(professor_id, quantidade);
        res.status(200).json(resultado);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAll,
    getByCpf,
    getByUsuarioId,
    post,
    put,
    del,
    enviarMoedas,
    adicionarMoedas
};