import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [category, setCategory] = useState('General');

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tasks', 
        { description, due_time: dueTime, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDescription('');
      setDueTime('');
      fetchTasks();
    } catch (err) {
      alert("Failed to add task. Check if server is running.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial' }}>
      {/* Header Section */}
      <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ marginRight: '20px' }}>Total: {tasks.length}</span>
          <span>Done: {tasks.filter(t => t.completed).length}</span>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ backgroundColor: '#ef4444', border: 'none', color: 'white', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>LOGOUT</button>
      </div>

      {/* Form Section */}
      <form onSubmit={handleAddTask} style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <input 
          style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
          placeholder="What needs to be done?" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="datetime-local" style={{ flex: 2, padding: '10px' }} value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
          <select style={{ flex: 1, padding: '10px' }} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </select>
          <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Add Task</button>
        </div>
      </form>

      {/* Task List */}
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        {tasks.map(t => (
          <li key={t.id} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
            <span>{t.description} <small style={{ color: '#888' }}>({t.category})</small></span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;