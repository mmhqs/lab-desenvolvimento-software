const conn = require('./conexao_bd');

const verificarTipoUsuario = async (usuario_id) => {
    const [aluno] = await conn.query('SELECT 1 FROM aluno WHERE usuario_id = ? LIMIT 1', [usuario_id]);
    const [empresa] = await conn.query('SELECT 1 FROM empresa_parceira WHERE usuario_id = ? LIMIT 1', [usuario_id]);
    
    return {
        isAluno: aluno.length > 0,
        isEmpresa: empresa.length > 0
    };
};

module.exports = {
    verificarTipoUsuario
};