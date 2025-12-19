import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './src/config/db.config.js'; 
import authRoutes from './src/routes/auth.routes.js';
import taskRoutes from './src/routes/task.routes.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'https://taskmaster-frontend-567v.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;

// This function automatically creates your tables since you can't access the Shell
const initDatabase = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
    try {
        await pool.query(queryText);
        console.log("✅ Database tables initialized and ready!");
    } catch (err) {
        console.error("❌ Database initialization failed:", err);
    }
};

// Initialize DB then start the server
initDatabase().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server is live on port ${PORT}`);
    });
});