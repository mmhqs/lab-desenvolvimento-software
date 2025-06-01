const conn = require('./conexao_bd');
const alunoModel = require('./alunoModel');

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
    const query = `
        SELECT p.*, u.* 
        FROM ${table} p
        JOIN usuario u ON p.usuario_id = u.id
        WHERE p.usuario_id = ?
    `;
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


const enviarMoedas = async (professor_id, aluno_id, quantidade, motivo) => {
    if (!professor_id || !aluno_id || !quantidade || quantidade <= 0) {
        throw new Error("Professor ID, Aluno ID e uma quantidade positiva de moedas são obrigatórios.");
    }

    const [professor, aluno] = await Promise.all([
        getByUsuarioId(professor_id),
        alunoModel.getByUsuarioId(aluno_id)
    ]);

    if (!professor) throw new Error("Professor não encontrado.");
    if (!aluno) throw new Error("Aluno não encontrado.");
    if (professor.saldo_moedas < quantidade) throw new Error("Saldo de moedas insuficiente.");

    const connection = await conn.getConnection();
    await connection.beginTransaction();

    try {
        await connection.query(
            'UPDATE professor SET saldo_moedas = ? WHERE usuario_id = ?',
            [professor.saldo_moedas - quantidade, professor_id]
        );

        await connection.query(
            'UPDATE aluno SET saldo_moedas = ? WHERE usuario_id = ?',
            [aluno.saldo_moedas + quantidade, aluno_id]
        );

        const [result] = await connection.query(
            `INSERT INTO transacao 
             (quantidade_moedas, mensagem, remetente_id, destinatario_id, data)
             VALUES (?, ?, ?, ?, now())`,
            [quantidade, motivo || 'Transferência de moedas', professor_id, aluno_id]
        );

        await connection.commit();
        connection.release();

        return {
            message: "Moedas transferidas com sucesso.",
            saldoProfessor: professor.saldo_moedas - quantidade,
            saldoAluno: aluno.saldo_moedas + quantidade,
            transacao_id: result.insertId,
            professor,
            aluno
        };

    } catch (err) {
        await connection.rollback();
        connection.release();
        throw err;
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