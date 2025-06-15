const alunoModel = require('../Models/alunoModel');
const empresaParceiraModel = require('../Models/empresaParceiraModel');
const email = require('../middlewares/email');

const getAll = (req, res) => {
    alunoModel.getAll()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const getByCpf = (req, res) => {
    const cpf = req.params.cpf;

    alunoModel.getByCpf(cpf)
        .then(data => {
            if (data) return res.status(200).json(data);
            return res.status(404).json({ error: "Aluno não encontrado." });
        })
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const getSaldo = (req, res) => {
    const cpf = req.params.cpf;

    alunoModel.getByCpf(cpf)
        .then(data => {
            if (!data) {
                return res.status(404).json({ error: "Aluno não encontrado." });
            }
            return res.status(200).json({ saldo_moedas: data.saldo_moedas });
        })
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const getTransacoes = (req, res) => {
    const cpf = req.params.cpf;

    alunoModel.getTransacoes(cpf)
        .then(data => {
            if (!data) {
                return res.status(404).json({ error: "Aluno não encontrado." });
            }
            return res.status(200).json(data);
        })
        .catch(err => res.status(500).json({ error: err['sqlMessage'] }));
};

const getByUsuarioId = (req, res) => {
    const usuario_id = req.params.usuario_id;

    alunoModel.getByUsuarioId(usuario_id)
        .then(data => {
            if (data) return res.status(200).json(data);
            return res.status(404).json({ error: "Aluno não encontrado para este usuário." });
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
        .then(async (result) => {
            const [aluno, vantagem] = await Promise.all([
                alunoModel.getAlunoComUsuario(cpf),
                empresaParceiraModel.getVantagemById(id_vantagem)
            ]);

            if (!aluno || !vantagem) {
                console.error('Informações incompletas para envio de email');
                return res.status(200).json({
                    message: "Vantagem resgatada com sucesso! (email não enviado)",
                    novoSaldo: result.novoSaldo,
                    registroId: result.registroId
                });
            }

            const assunto = `Confirmação de Resgate - ${vantagem.descricao}`;
            const corpo = `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #1a73e8; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🎉 Vantagem Resgatada!</h1>
                    </div>
                    
                    <div style="padding: 25px;">
                        <p style="font-size: 16px;">Olá, <strong>${aluno.nome}</strong>!</p>
                        
                        <div style="background-color: #e8f0fe; border-left: 4px solid #1a73e8; padding: 12px; margin: 15px 0; border-radius: 0 4px 4px 0;">
                            <p style="margin: 0; color: #1a73e8; font-weight: bold;">
                                Você resgatou com sucesso a vantagem "${vantagem.id}"!
                            </p>
                        </div>
                        
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0;"><strong>Detalhes do resgate:</strong></p>
                            <ul style="margin: 5px 0 0 0; padding-left: 20px;">
                                <li><strong>Cupom para uso físico:</strong> ${vantagem.cupom}</li>
                                <li><strong>Descrição:</strong> ${vantagem.descricao}</li>
                                <li><strong>Custo:</strong> ${vantagem.custo_moedas} moedas</li>
                                <li><strong>Saldo restante:</strong> ${result.novoSaldo} moedas</li>
                                <li><strong>Data:</strong> ${new Date().toLocaleString()}</li>
                            </ul>
                        </div>
                        
                        <p style="font-size: 15px;">Aproveite sua vantagem e continue acumulando moedas!</p>
                        
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #70757a; border-top: 1px solid #e0e0e0;">
                        <p style="margin: 0;">Sistema de Moedas Acadêmicas</p>
                    </div>
                </div>
            `;

            try {
                await email.enviarEmail(aluno.email, assunto, corpo);
                res.status(200).json({
                    message: "Vantagem resgatada com sucesso e confirmação enviada por email!",
                    novoSaldo: result.novoSaldo,
                    registroId: result.registroId
                });
            } catch (emailError) {
                console.error('Erro ao enviar email:', emailError);
                res.status(200).json({
                    message: "Vantagem resgatada com sucesso! (erro no envio do email de confirmação)",
                    novoSaldo: result.novoSaldo,
                    registroId: result.registroId
                });
            }
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
    getSaldo,
    getTransacoes,
    post,
    put,
    del,
    adicionarMoedas,
    removerMoedas,
    resgatarVantagem,
    getVantagensResgatadas
};