import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api'; 
import { useAuth } from '../AuthContext'; 

const Dashboard = () => {
  const { logout } = useAuth(); 
  const [tasks, setTasks] = useState([]);
  // Changed "description" to "title" to match your server.js table schema
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Data object matches what your new Task Controller expects
      const taskData = { 
        title: title, 
        description: description 
      };

      if (editId) {
        await updateTask(editId, taskData);
        setEditId(null);
      } else {
        await createTask(taskData);
      }
      
      // Clear inputs
      setTitle('');
      setDescription('');
      fetchTasks(); 
    } catch (err) {
      alert("Error saving task. Check your Render logs.");
      console.error(err);
    }
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setTitle(task.title);
    setDescription(task.description || '');
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Delete this task?")) {
      try {
        await deleteTask(id);
        fetchTasks();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto', fontFamily: 'Arial' }}>
      <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '15px 25px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>TaskMaster Dashboard</h2>
        <button onClick={logout} style={{ backgroundColor: '#ef4444', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          LOGOUT
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ border: editId ? '2px solid #fbbf24' : '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0 }}>{editId ? "📝 Edit Task" : "➕ Add Task"}</h3>
        
        <input 
          style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
          placeholder="Task Title (required)" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <textarea 
          style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc', fontFamily: 'inherit' }}
          placeholder="Detailed Description (optional)" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit" style={{ width: '100%', backgroundColor: editId ? '#fbbf24' : '#2563eb', color: editId ? 'black' : 'white', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {editId ? "Save Changes" : "Create Task"}
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(t => (
          <li key={t.id} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', marginBottom: '8px', borderRadius: '5px' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1e3a8a' }}>{t.title}</div>
              <div style={{ color: '#4b5563', fontSize: '0.9rem' }}>{t.description}</div>
              <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Status: {t.status}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => startEdit(t)} style={{ backgroundColor: '#fbbf24', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
              <button onClick={() => handleDeleteTask(t.id)} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;