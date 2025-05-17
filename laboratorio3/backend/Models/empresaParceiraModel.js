const conn = require('./conexao_bd');

const table = "empresa_parceira";

const getByCnpj = async (cnpj) => {
    const empresaQuery = `SELECT * FROM ${table} WHERE cnpj = ?`;
    const vantagensQuery = `SELECT * FROM vantagem WHERE empresa_cnpj = ?`;
    
    const [empresaRows] = await conn.query(empresaQuery, [cnpj]);
    const [vantagensRows] = await conn.query(vantagensQuery, [cnpj]);
    
    if (empresaRows.length === 0) return null;
    
    return {
        ...empresaRows[0],
        vantagens: vantagensRows
    };
};

const getAll = async () => {
    const empresasQuery = `SELECT * FROM ${table}`;
    const [empresasRows] = await conn.query(empresasQuery);
    
    const empresasComVantagens = await Promise.all(
        empresasRows.map(async (empresa) => {
            const [vantagensRows] = await conn.query(
                `SELECT * FROM vantagem WHERE empresa_cnpj = ?`,
                [empresa.cnpj]
            );
            return {
                ...empresa,
                vantagens: vantagensRows
            };
        })
    );
    
    return empresasComVantagens;
};

const getByUsuarioId = async (usuario_id) => {
    const query = `SELECT * FROM ${table} WHERE usuario_id = ?`;
    const [rows] = await conn.query(query, [usuario_id]);
    return rows[0];
};

const cnpjExists = async (cnpj) => {
    const query = `SELECT 1 FROM ${table} WHERE cnpj = ? LIMIT 1`;
    const [rows] = await conn.query(query, [cnpj]);
    return rows.length > 0;
};

const post = async (cnpj, usuario_id) => {
    const query = `
        INSERT INTO ${table} 
        (cnpj, usuario_id)
        VALUES (?, ?)
    `;
    const [result] = await conn.query(query, [cnpj, usuario_id]);
    return result;
};

const put = async (cnpj, usuario_id) => {
    const query = `
        UPDATE ${table} 
        SET usuario_id = ?
        WHERE cnpj = ?
    `;
    const [result] = await conn.query(query, [usuario_id, cnpj]);
    return result.affectedRows > 0;
};

const del = async (cnpj) => {
    const query = `DELETE FROM ${table} WHERE cnpj = ?`;
    const [result] = await conn.query(query, [cnpj]);
    return result.affectedRows > 0;
};

const addVantagem = async (empresa_cnpj, vantagemData) => {
    const query = `
        INSERT INTO vantagem 
        (id, custo_moedas, descricao, foto, empresa_cnpj)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await conn.query(query, [
        vantagemData.id,
        vantagemData.custo_moedas,
        vantagemData.descricao,
        vantagemData.foto,
        empresa_cnpj
    ]);
    return result;
};

const removeVantagem = async (vantagem_id) => {
    const query = `DELETE FROM vantagem WHERE id = ?`;
    const [result] = await conn.query(query, [vantagem_id]);
    return result.affectedRows > 0;
};

module.exports = {
    getAll,
    getByCnpj,
    getByUsuarioId,
    cnpjExists,
    post,
    put,
    del,
    addVantagem,
    removeVantagem
};