import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './src/config/db.config.js'; // 1. Import your database config
import authRoutes from './src/routes/auth.routes.js';
import taskRoutes from './src/routes/task.routes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;

// 2. Sync Database before starting the server
sequelize.sync().then(() => {
    console.log("✅ Database connected and tables synced!");
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server actually listening on port ${PORT}`);
    });
}).catch(err => {
    console.error("❌ Unable to connect to the database:", err);
});