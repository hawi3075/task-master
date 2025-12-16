// frontend/src/App.jsx (UPDATED FOR AUTH)

import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from './api'; // Use our custom Axios instance
import AuthForm from './AuthForm';

const TaskList = ({ tasks, handleDeleteTask, handleToggleComplete }) => (
  // ... (This will be the task rendering code from the previous step)
  // For simplicity, just use the list part:
  <ul className="space-y-3">
      {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div 
                  className="flex items-center flex-grow cursor-pointer"
                  onClick={() => handleToggleComplete(task.id, task.is_completed)}
              >
                  <input
                      type="checkbox"
                      checked={task.is_completed}
                      readOnly
                      className="form-checkbox h-5 w-5 text-blue-600 rounded"
                  />
                  <span 
                      className={`ml-3 text-lg ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                  >
                      {task.description}
                  </span>
              </div>
              <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-700 ml-4">
                 {/* SVG icon here */}
              </button>
          </li>
      ))}
  </ul>
);

// The main App component handles the conditional rendering and data fetching
function App() {
  const { isAuthenticated, logout, user } = useAuth(); // Use the context
  const [tasks, setTasks] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to fetch tasks (called only if authenticated)
  const fetchTasks = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      // Use '/tasks' path since the api instance has the base URL
      const response = await api.get('/tasks'); 
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // If 401 Unauthorized, log the user out
      if (error.response && error.response.status === 401) logout(); 
    } finally {
      setLoading(false);
    }
  };

  // Refetch tasks whenever the user logs in/out
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]); // Clear tasks if logged out
    }
  }, [isAuthenticated]); 

  // ... (Implement handleCreateTask, handleToggleComplete, handleDeleteTask using 'api' instance instead of axios.get/post)

  const handleCreateTask = async (e) => {
      e.preventDefault();
      if (newTaskDescription.trim() === '') return;
      try {
          const response = await api.post('/tasks', { description: newTaskDescription });
          setTasks([...tasks, response.data]);
          setNewTaskDescription('');
      } catch (error) {
          console.error('Error creating task:', error);
      }
  };

  const handleToggleComplete = async (id, is_completed) => {
      try {
          const response = await api.put(`/tasks/${id}`, { is_completed: !is_completed });
          setTasks(tasks.map(task => 
              task.id === id ? response.data : task
          ));
      } catch (error) {
          console.error('Error updating task:', error);
      }
  };

  const handleDeleteTask = async (id) => {
      try {
          await api.delete(`/tasks/${id}`);
          setTasks(tasks.filter(task => task.id !== id));
      } catch (error) {
          console.error('Error deleting task:', error);
      }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <header className="flex justify-between items-center mb-6 border-b pb-2">
          <h1 className="text-3xl font-bold text-gray-800">TaskMaster</h1>
          {isAuthenticated && (
            <div className="flex items-center">
              <span className="text-sm mr-4 text-gray-600">Logged in as: {user.email}</span>
              <button 
                onClick={logout} 
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg text-sm transition"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {isAuthenticated ? (
          // RENDER TO-DO LIST
          <>
            {/* Task Form (CREATE) */}
            <form onSubmit={handleCreateTask} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-150"
              >
                Add Task
              </button>
            </form>

            {loading ? (
                <p className="text-center text-gray-500">Loading tasks...</p>
            ) : (
                <TaskList 
                    tasks={tasks} 
                    handleDeleteTask={handleDeleteTask} 
                    handleToggleComplete={handleToggleComplete}
                />
            )}
          </>
        ) : (
          // RENDER LOGIN/REGISTER FORM
          <AuthForm />
        )}
      </div>
    </div>
  );
}

export default App;