import pool from '../config/db.config.js';

export const getTasks = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC", [req.user.id]);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const createTask = async (req, res) => {
    try {
        const { description, due_time, category } = req.body;
        const result = await pool.query(
            "INSERT INTO tasks (description, due_time, category, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [description, due_time || null, category || 'General', req.user.id]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
};


export const updateTask = async (req, res) => {
    const { id } = req.params; 
    const { description, due_time, category, completed } = req.body; 
    const userId = req.user.id; 

    try {
        
        const result = await pool.query(
            `UPDATE tasks 
             SET description = $1, 
                 due_time = $2, 
                 category = $3, 
                 completed = $4 
             WHERE id = $5 AND user_id = $6 
             RETURNING *`,
            [
                description, 
                due_time || null, 
                category || 'General', 
                completed !== undefined ? completed : false, 
                id, 
                userId
            ]
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

export const deleteTask = async (req, res) => {
    try {
        await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};