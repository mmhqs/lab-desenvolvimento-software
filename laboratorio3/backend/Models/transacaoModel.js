const conn = require('./conexao_bd');

const table = "transacao";

const getAll = async () => {
    const query = `SELECT * FROM ${table}`;
    const [rows] = await conn.query(query);
    return rows;
};

const getById = async (id) => {
    const query = `SELECT * FROM ${table} WHERE id = ?`;
    const [rows] = await conn.query(query, [id]);
    return rows[0];
};

const getByRemetente = async (remetente_id) => {
    const query = `SELECT * FROM ${table} WHERE remetente_id = ?`;
    const [rows] = await conn.query(query, [remetente_id]);
    return rows;
};

const getByDestinatario = async (destinatario_id) => {
    const query = `SELECT * FROM ${table} WHERE destinatario_id = ?`;
    const [rows] = await conn.query(query, [destinatario_id]);
    return rows;
};

const post = async ( quantidade_moedas, mensagem, remetente_id, destinatario_id) => {
    const query = `
        INSERT INTO ${table} 
        ( quantidade_moedas, mensagem, remetente_id, destinatario_id)
        VALUES ( ?, ?, ?, ?)
    `;
    const [result] = await conn.query(query, [ quantidade_moedas, mensagem, remetente_id, destinatario_id]);
    return result.insertId;
};

const put = async (id,  quantidade_moedas, mensagem, remetente_id, destinatario_id) => {
    const query = `
        UPDATE ${table} 
        SET quantidade_moedas = ?, mensagem = ?, remetente_id = ?, destinatario_id = ?
        WHERE id = ?
    `;
    const [result] = await conn.query(query, [ quantidade_moedas, mensagem, remetente_id, destinatario_id, id]);
    return result.affectedRows > 0;
};

const del = async (id) => {
    const query = `DELETE FROM ${table} WHERE id = ?`;
    const [result] = await conn.query(query, [id]);
    return result.affectedRows > 0;
};

const getTransacoesEntreUsuarios = async (usuario1_id, usuario2_id) => {
    const query = `
        SELECT * FROM ${table} 
        WHERE (remetente_id = ? AND destinatario_id = ?)
        OR (remetente_id = ? AND destinatario_id = ?)
        ORDER BY data DESC
    `;
    const [rows] = await conn.query(query, [usuario1_id, usuario2_id, usuario2_id, usuario1_id]);
    return rows;
};

module.exports = {
    getAll,
    getById,
    getByRemetente,
    getByDestinatario,
    post,
    put,
    del,
    getTransacoesEntreUsuarios
};