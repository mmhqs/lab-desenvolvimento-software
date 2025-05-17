const conn = require('./conexao_bd');

const table = "usuario";

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

const getByEmail = async (email) => {
    const query = `SELECT * FROM ${table} WHERE email = ?`;
    const [rows] = await conn.query(query, [email]);
    return rows[0];
};

const emailExists = async (email) => {
    const query = `SELECT 1 FROM ${table} WHERE email = ? LIMIT 1`;
    const [rows] = await conn.query(query, [email]);
    return rows.length > 0;
};

const post = async (nome, email, senha) => {
    const query = `
        INSERT INTO ${table} 
        (nome, email, senha)
        VALUES (?, ?, ?)
    `;
    const [result] = await conn.query(query, [nome, email, senha]);
    return result;
};

const put = async (id, nome, email, senha) => {
    const query = `
        UPDATE ${table} 
        SET nome = ?, email = ?, senha = ?
        WHERE id = ?
    `;
    const [result] = await conn.query(query, [nome, email, senha, id]);
    return result.affectedRows > 0;
};

const del = async (id) => {
    const query = `DELETE FROM ${table} WHERE id = ?`;
    const [result] = await conn.query(query, [id]);
    return result.affectedRows > 0;
};

module.exports = {
    getAll,
    getById,
    getByEmail,
    emailExists,
    post,
    put,
    del
};