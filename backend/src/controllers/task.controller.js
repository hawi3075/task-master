// backend/src/controllers/task.controller.js

const db = require('../config/db.config');

// 1. READ (Get All Tasks) - R
exports.getAllTasks = async (req, res) => {
  // Filter tasks by the authenticated user's ID
  try {
    const result = await db.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at ASC', [req.userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. CREATE (Add a New Task) - C
exports.createTask = async (req, res) => {
  const { description } = req.body;
  const user_id = req.userId; // Get user ID from the authentication middleware

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }
  try {
    const text = 'INSERT INTO tasks(description, user_id) VALUES($1, $2) RETURNING *';
    const values = [description, user_id];
    const result = await db.query(text, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. UPDATE (Edit/Toggle Status) - U
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const user_id = req.userId;
  const { description, is_completed } = req.body;
  
  // Update task only if it matches the ID AND the authenticated user_id
  const text = `
    UPDATE tasks 
    SET description = COALESCE($1, description), 
        is_completed = COALESCE($2, is_completed)
    WHERE id = $3 AND user_id = $4
    RETURNING *;
  `;
  const values = [description, is_completed, id, user_id];

  try {
    const result = await db.query(text, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or does not belong to user.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. DELETE (Remove a Task) - D
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const user_id = req.userId;
  try {
    // Delete task only if it matches the ID AND the authenticated user_id
    const text = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *';
    const result = await db.query(text, [id, user_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or does not belong to user.' });
    }
    res.json({ message: 'Task deleted successfully', deletedTask: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};