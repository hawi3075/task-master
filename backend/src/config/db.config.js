import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  // This uses the Internal Database URL you added to your Render Environment
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // This is required for Render PostgreSQL connections
    rejectUnauthorized: false
  }
});

// Test the connection immediately when the file is loaded
pool.on('connect', () => {
  console.log('🐘 PostgreSQL connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
});

export default pool;