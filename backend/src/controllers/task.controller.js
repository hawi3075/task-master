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
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        // ... your database logic ...
        res.json({ message: "Task updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};