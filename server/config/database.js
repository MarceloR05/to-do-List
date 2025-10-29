const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'todoapp',
  password: process.env.DB_PASSWORD || 'catolica10',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

module.exports = pool;