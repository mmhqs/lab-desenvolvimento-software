const conn = require('./conexao_bd');

const table = "professor";

const getAll = async () => {
    const query = `SELECT * FROM ${table}`;
    const [rows] = await conn.query(query);
    return rows;
};

const getByCpf = async (cpf) => {
    const query = `SELECT * FROM ${table} WHERE cpf = ?`;
    const [rows] = await conn.query(query, [cpf]);
    return rows[0];
};

const getByUsuarioId = async (usuario_id) => {
    const query = `SELECT * FROM ${table} WHERE usuario_id = ?`;
    const [rows] = await conn.query(query, [usuario_id]);
    return rows[0];
};

const cpfExists = async (cpf) => {
    const query = `SELECT 1 FROM ${table} WHERE cpf = ? LIMIT 1`;
    const [rows] = await conn.query(query, [cpf]);
    return rows.length > 0;
};

const post = async (cpf, departamento, saldoMoedas, usuario_id) => {
    const query = `
        INSERT INTO ${table} 
        (cpf, departamento, saldo_moedas, usuario_id)
        VALUES (?, ?, ?, ?)
    `;
    const [result] = await conn.query(query, [cpf, departamento, saldoMoedas, usuario_id]);
    return result.insertId;
};

const put = async (cpfAtual, novosDados) => {
    const { cpf: novoCpf, departamento, saldo_moedas } = novosDados;
    
    const query = `
        UPDATE ${table} 
        SET 
            cpf = COALESCE(?, cpf),
            departamento = COALESCE(?, departamento),
            saldo_moedas = COALESCE(?, saldo_moedas)
        WHERE cpf = ?
    `;
    
    const [result] = await conn.query(query, [
        novoCpf,
        departamento,
        saldo_moedas,
        cpfAtual
    ]);
    
    return result.affectedRows > 0;
};

const updateSaldoMoedas = async (cpf, saldoMoedas) => {
    const query = `
        UPDATE ${table} 
        SET saldo_moedas = ?
        WHERE cpf = ?
    `;
    const [result] = await conn.query(query, [saldoMoedas, cpf]);
    return result.affectedRows > 0;
};

const del = async (cpf) => {
    const query = `DELETE FROM ${table} WHERE cpf = ?`;
    const [result] = await conn.query(query, [cpf]);
    return result.affectedRows > 0;
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
            professorModel.getByCpf(professor_id),
            alunoModel.getById(aluno_id)
        ]);

        if (!professor) {
            return res.status(404).json({ error: "Professor não encontrado." });
        }
        if (!aluno) {
            return res.status(404).json({ error: "Aluno não encontrado." });
        }

        if (professor.saldo_moedas < quantidade) {
            return res.status(400).json({ 
                error: "Saldo de moedas insuficiente para realizar a transferência." 
            });
        }

        const professorUsuarioId = professor.usuario_id;
        const alunoUsuarioId = aluno.usuario_id;

        const connection = await conn.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query(
                'UPDATE professor SET saldo_moedas = ? WHERE id = ?',
                [professor.saldo_moedas - quantidade, professor_id]
            );

            await connection.query(
                'UPDATE aluno SET saldo_moedas = ? WHERE id = ?',
                [aluno.saldo_moedas + quantidade, aluno_id]
            );

            const [transacaoResult] = await connection.query(
                `INSERT INTO transcacao 
                (quantidade_moedas, mensagem, remetente_id, destinatario_id) 
                VALUES (?, ?, ?, ?)`,
                [quantidade, motivo || 'Transferência de moedas', professorUsuarioId, alunoUsuarioId]
            );

            await connection.commit();

            const [professorAtualizado, alunoAtualizado, transacao] = await Promise.all([
                professorModel.getById(professor_id),
                alunoModel.getById(aluno_id),
                transcacaoModel.getById(transacaoResult.insertId)
            ]);

            res.status(200).json({ 
                message: "Moedas transferidas com sucesso.",
                professor: {
                    saldo_moedas: professorAtualizado.saldo_moedas
                },
                aluno: {
                    saldo_moedas: alunoAtualizado.saldo_moedas
                },
                transacao: transacao
            });

        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

    } catch (err) {
        console.error('Erro ao enviar moedas:', err);
        res.status(500).json({ 
            error: err['sqlMessage'] || err.message || 'Erro ao processar a transferência' 
        });
    }
};

module.exports = {
    getAll,
    getByCpf,
    getByUsuarioId,
    cpfExists,
    post,
    put,
    updateSaldoMoedas,
    del,
    enviarMoedas
};