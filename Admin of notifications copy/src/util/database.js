const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'admin_notifications',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const fixSequence = async (pool, tableName) => {
  try {
    await pool.query(`
      SELECT setval('${tableName}_id_seq', COALESCE((SELECT MAX(id) FROM ${tableName}), 0) + 1, false)
    `);
  } catch (error) {
    console.error(`Error fixing sequence for ${tableName}:`, error);
  }
};

module.exports = { pool, fixSequence };