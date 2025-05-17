const mysql = require('mysql2/promise'); 
require('dotenv').config(); 

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'cleito',
  port: process.env.DB_PORT || 3306, 
  waitForConnections: true
});

(async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
  } catch (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    process.exit(1);
  }
})();

module.exports = pool;