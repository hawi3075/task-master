import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api'; 
import { useAuth } from '../AuthContext'; 

const Dashboard = () => {
  const { logout } = useAuth(); 
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeInterval, setTimeInterval] = useState(''); 
  const [taskDate, setTaskDate] = useState(''); // New State for Calendar
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
      const taskData = { 
        title, 
        description,
        timeInterval,
        taskDate // Now sending both Time and Date
      };

      if (editId) {
        await updateTask(editId, taskData);
        setEditId(null);
      } else {
        await createTask(taskData);
      }
      
      setTitle('');
      setDescription('');
      setTimeInterval('');
      setTaskDate('');
      fetchTasks(); 
    } catch (err) {
      // If you see this alert, check your Render backend logs!
      alert("Error saving task. Make sure database columns match!");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto', fontFamily: 'Arial' }}>
      {/* Header section matches your working dashboard */}
      <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '15px 25px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>TaskMaster</h2>
        <button onClick={logout} style={{ backgroundColor: '#ef4444', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>LOGOUT</button>
      </div>

      <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0 }}>{editId ? "📝 Edit Task" : "➕ Add Task"}</h3>
        
        <input 
          style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
          placeholder="Task Title (required)" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        {/* ROW FOR TIME AND CALENDAR */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input 
            style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
            placeholder="Time (e.g., 5 to 6 PM)" 
            value={timeInterval}
            onChange={(e) => setTimeInterval(e.target.value)}
          />
          <input 
            type="date"
            style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
          />
        </div>

        <textarea 
          style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc', fontFamily: 'inherit' }}
          placeholder="Description" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit" style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {editId ? "Save Changes" : "Create Task"}
        </button>
      </form>

      {/* Task List display */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(t => (
          <li key={t.id} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', marginBottom: '8px', borderRadius: '5px' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1e3a8a' }}>{t.title}</div>
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#2563eb', margin: '4px 0' }}>
                {t.time_interval && <span>⏰ {t.time_interval}</span>}
                {t.task_date && <span>📅 {new Date(t.task_date).toLocaleDateString()}</span>}
              </div>
              <div style={{ color: '#4b5563', fontSize: '0.9rem' }}>{t.description}</div>
            </div>
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setEditId(t.id)} style={{ backgroundColor: '#fbbf24', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
              <button onClick={() => handleDeleteTask(t.id)} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;