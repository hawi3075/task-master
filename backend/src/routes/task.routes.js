import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller.js';
// Ensure this name matches exactly what is exported in your auth.middleware.js
import { authenticateToken } from '../middleware/auth.middleware.js'; 

const router = express.Router();

// All routes now pass through authenticateToken to ensure req.user.id is populated
router.get('/', authenticateToken, getTasks);
router.post('/', authenticateToken, createTask);
router.put('/:id', authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);

export default router;