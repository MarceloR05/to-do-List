const pool = require('./config/database');

(async () => {
  try {
    console.log('Testing DB connection...');
    const now = await pool.query('SELECT NOW()');
    console.log('DB time:', now.rows[0]);
    const r = await pool.query("SELECT to_regclass('public.tasks') as exists");
    console.log('tasks table exists:', r.rows[0].exists);
    const sample = await pool.query('SELECT * FROM tasks LIMIT 1');
    console.log('sample rows:', sample.rows);
    process.exit(0);
  } catch (err) {
    console.error('DB test error:', err.message);
    process.exit(1);
  }
})();