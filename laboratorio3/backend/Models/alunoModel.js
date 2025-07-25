const conn = require('./conexao_bd');

const empresaModel = require('./empresaParceiraModel');

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

const getAlunoComUsuario = async (cpf) => {
    const query = `
        SELECT a.*, u.nome, u.email 
        FROM aluno a
        JOIN usuario u ON a.usuario_id = u.id
        WHERE a.cpf = ?
    `;
    const [rows] = await conn.query(query, [cpf]);
    return rows[0];
};

const getVantagemById = async (id) => {
    const query = 'SELECT * FROM vantagem WHERE id = ?';
    const [rows] = await conn.query(query, [id]);
    return rows[0];
};

const getByUsuarioId = async (usuario_id) => {
    const query = `
        SELECT a.*, u.*
        FROM ${table} a
        JOIN usuario u ON a.usuario_id = u.id
        WHERE a.usuario_id = ?
    `;
    const [rows] = await conn.query(query, [usuario_id]);
    return rows[0];
};

const getTransacoes = async (cpf) => {
    const queryRecebidas = `
        SELECT 
            t.id,
            t.data,
            t.quantidade_moedas as quantidadeMoedas,
            t.mensagem,
            t.remetente_id as remetente,
            t.destinatario_id as destinatario
        FROM transacao t
        WHERE t.destinatario_id = ?
        UNION ALL
        -- Busca transações onde o aluno é o remetente (enviou moedas)
        SELECT 
            t.id,
            t.data,
            t.quantidade_moedas as quantidadeMoedas,
            t.mensagem,
            t.remetente_id as remetente,
            t.destinatario_id as destinatario
        FROM transacao t
        WHERE t.remetente_id = ?
        ORDER BY data DESC
    `;
    
    const [rows] = await conn.query(queryRecebidas, [cpf, cpf]);
    return rows;
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
            `SELECT v.custo_moedas, v.empresa_cnpj, e.usuario_id as empresa_usuario_id
             FROM vantagem v
             JOIN empresa_parceira e ON v.empresa_cnpj = e.cnpj
             WHERE v.id = ? FOR UPDATE`,
            [idVantagem]
        );
        
        if (vantagem.length === 0) {
            throw new Error('Vantagem não encontrada');
        }
        
        const custo = vantagem[0].custo_moedas;
        const empresaUsuarioId = vantagem[0].empresa_usuario_id;
        
        const [aluno] = await conn.query(
            'SELECT saldo_moedas, usuario_id FROM aluno WHERE cpf = ? FOR UPDATE',
            [cpfAluno]
        );
        
        if (aluno.length === 0) {
            throw new Error('Aluno não encontrado');
        }
        
        if (aluno[0].saldo_moedas < custo) {
            throw new Error('Saldo insuficiente');
        }
        
        const alunoUsuarioId = aluno[0].usuario_id;
        
        await conn.query(
            'UPDATE aluno SET saldo_moedas = saldo_moedas - ? WHERE cpf = ?',
            [custo, cpfAluno]
        );
        
        const [transacaoResult] = await conn.query(
            'INSERT INTO transacao (quantidade_moedas, mensagem, data, remetente_id, destinatario_id) VALUES (?, ?, NOW(), ?, ?)',
            [custo, `Resgate da vantagem #${idVantagem}`, empresaUsuarioId, alunoUsuarioId]
        );
        
        const [vantagemResult] = await conn.query(
            'INSERT INTO aluno_vantagem (aluno_id, vantagem_id) VALUES (?, ?)',
            [cpfAluno, idVantagem]
        );
        
        await conn.query('COMMIT');
        
        return {
            success: true,
            novoSaldo: aluno[0].saldo_moedas - custo
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
    getVantagensResgatadas,
    getTransacoes,
    getAlunoComUsuario
};