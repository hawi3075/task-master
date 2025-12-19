import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; 

const Dashboard = () => {
  const { logout } = useAuth(); 
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [category, setCategory] = useState('General');
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem('token');

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/tasks/${editId}`, 
          { description, due_time: dueTime, category },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/api/tasks', 
          { description, due_time: dueTime, category },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setDescription('');
      setDueTime('');
      fetchTasks(); 
    } catch (err) {
      alert("Error saving task");
    }
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setDescription(task.description);
    if (task.due_time) {
      const date = new Date(task.due_time);
      setDueTime(date.toISOString().slice(0, 16));
    }
    setCategory(task.category);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this task?")) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTasks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto', fontFamily: 'Arial' }}>
      <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '15px 25px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>TaskMaster</h2>
        <button onClick={logout} style={{ backgroundColor: '#ef4444', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          LOGOUT
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ border: editId ? '2px solid #fbbf24' : '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0 }}>{editId ? "📝 Edit Task" : "➕ Add Task"}</h3>
        <input 
          style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
          placeholder="What needs to be done?" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="datetime-local" style={{ flex: 2, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
          <button type="submit" style={{ backgroundColor: editId ? '#fbbf24' : '#2563eb', color: editId ? 'black' : 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            {editId ? "Save Changes" : "Add Task"}
          </button>
        </div>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(t => (
          <li key={t.id} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{t.description}</div>
              <div style={{ color: '#666', fontSize: '0.85rem' }}>📅 {new Date(t.due_time).toLocaleString()}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => startEdit(t)} style={{ backgroundColor: '#fbbf24', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Update</button>
              <button onClick={() => handleDelete(t.id)} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;