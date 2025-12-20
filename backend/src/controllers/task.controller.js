import pool from '../config/db.config.js';

// --- GET TASKS ---
export const getTasks = async (req, res) => {
    try {
        // Matches the table structure in your server.js
        const result = await pool.query(
            "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC", 
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

// --- CREATE TASK ---
export const createTask = async (req, res) => {
    try {
        // We use 'title' and 'description' to match your server.js initDatabase
        const { title, description } = req.body; 
        
        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const result = await pool.query(
            "INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, description || '', req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { 
        console.error("INSERT ERROR:", err.message);
        res.status(500).json({ error: "Database insert failed: " + err.message }); 
    }
};

// --- UPDATE TASK ---
export const updateTask = async (req, res) => {
    const { id } = req.params; 
    const { title, description, status } = req.body; 
    const userId = req.user.id; 

    try {
        const result = await pool.query(
            `UPDATE tasks 
             SET title = $1, 
                 description = $2, 
                 status = $3 
             WHERE id = $4 AND user_id = $5 
             RETURNING *`,
            [title, description, status || 'pending', id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found or unauthorized" });
        }

        res.json(result.rows[0]); 
    } catch (err) {
        console.error("UPDATE ERROR:", err.message);
        res.status(500).json({ error: "Database update failed" });
    }
};

// --- DELETE TASK ---
export const deleteTask = async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *", 
            [req.params.id, req.user.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        res.json({ message: "Deleted" });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};