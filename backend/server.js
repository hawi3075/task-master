const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

// --- Configuration Imports ---
require('./src/config/db.config'); // Initialize DB pool and connection check
// --- Route Imports (Will be added in Step 4) ---
const authRoutes = require('./src/routes/auth.routes'); 
const taskRoutes = require('./src/routes/task.routes'); 
// -----------------------------

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests from the frontend
app.use(express.json()); // Allow parsing JSON request bodies

// --- Route Usage (Will be used in Step 4) ---
app.use('/api/auth', authRoutes); // Auth routes (register, login)
app.use('/api/tasks', taskRoutes); // Task CRUD routes
// -----------------------------

// Simple Test Route
app.get('/', (req, res) => {
    res.send('TaskMaster Backend is Running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});