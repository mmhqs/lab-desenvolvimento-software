const conn = require('./conexao_bd');

const table = "aluno";

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

const usuarioHasAluno = async (usuario_id) => {
    const query = `SELECT 1 FROM ${table} WHERE usuario_id = ? LIMIT 1`;
    const [rows] = await conn.query(query, [usuario_id]);
    return rows.length > 0;
};

const post = async (cpf, usuario_id, rg, endereco, saldo_moedas = 0) => {
    const query = `
        INSERT INTO ${table} 
        (cpf, usuario_id, rg, endereco, saldo_moedas)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await conn.query(query, [cpf, usuario_id, rg, endereco, saldo_moedas]);
    return result;
};

const put = async (cpf, rg, endereco, saldo_moedas) => {
    const query = `
        UPDATE ${table}
        SET rg = ?,
            endereco = ?,
            saldo_moedas = ?
        WHERE cpf = ?
    `;
    const [result] = await conn.query(query, [rg, endereco, saldo_moedas, cpf]);
    return result;
};

const del = async (cpf) => {
    const query = `DELETE FROM ${table} WHERE cpf = ?`;
    const [result] = await conn.query(query, [cpf]);
    return result;
};

const adicionarMoedas = async (cpf, quantidade) => {
    const query = `
        UPDATE ${table} 
        SET saldo_moedas = saldo_moedas + ? 
        WHERE cpf = ?
    `;
    const [result] = await conn.query(query, [quantidade, cpf]);
    return result;
};

const removerMoedas = async (cpf, quantidade) => {
    const query = `
        UPDATE ${table} 
        SET saldo_moedas = saldo_moedas - ? 
        WHERE cpf = ? AND saldo_moedas >= ?
    `;
    const [result] = await conn.query(query, [quantidade, cpf, quantidade]);
    
    if (result.affectedRows === 0) {
        throw new Error('Saldo insuficiente ou aluno não encontrado');
    }
    
    return result;
};

const resgatarVantagem = async (cpfAluno, idVantagem) => {

    await conn.query('START TRANSACTION');
    
    try {
        const [vantagem] = await conn.query(
            'SELECT custo_moedas FROM vantagem WHERE id = ? FOR UPDATE',
            [idVantagem]
        );
        
        if (vantagem.length === 0) {
            throw new Error('Vantagem não encontrada');
        }
        
        const custo = vantagem[0].custo_moedas;
        
        const [aluno] = await conn.query(
            'SELECT saldo_moedas FROM aluno WHERE cpf = ? FOR UPDATE',
            [cpfAluno]
        );
        
        if (aluno.length === 0) {
            throw new Error('Aluno não encontrado');
        }
        
        if (aluno[0].saldo_moedas < custo) {
            throw new Error('Saldo insuficiente');
        }
        
        await conn.query(
            'UPDATE aluno SET saldo_moedas = saldo_moedas - ? WHERE cpf = ?',
            [custo, cpfAluno]
        );
        
        const [result] = await conn.query(
            'INSERT INTO aluno_vantagem (id_aluno, id_vantagem) VALUES (?, ?)',
            [cpfAluno, idVantagem]
        );
        
        await conn.query('COMMIT');
        
        return {
            success: true,
            novoSaldo: aluno[0].saldo_moedas - custo,
            registroId: result.insertId
        };
    } catch (error) {
        await conn.query('ROLLBACK');
        throw error;
    }
};

const getVantagensResgatadas = async (cpfAluno) => {
    const query = `
        SELECT v.* 
        FROM vantagem v
        JOIN aluno_vantagem av ON v.id = av.id_vantagem
        WHERE av.id_aluno = ?
    `;
    const [rows] = await conn.query(query, [cpfAluno]);
    return rows;
};

module.exports = {
    getAll,
    getByCpf,
    getByUsuarioId,
    cpfExists,
    usuarioHasAluno,
    post,
    put,
    del,
    adicionarMoedas,
    removerMoedas,
    resgatarVantagem,
    getVantagensResgatadas
};