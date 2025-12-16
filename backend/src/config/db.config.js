const { Pool } = require('pg');

// Pool automatically uses the PGUSER, PGPASSWORD, etc. from .env
const pool = new Pool();

// Simple check query to confirm connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('PostgreSQL: Database connected successfully.');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};