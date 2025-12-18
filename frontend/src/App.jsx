import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Register from './components/Register';


function App() {
  const { user, loading } = useAuth();

  // If the app is still checking for a token, show a clear white screen
  if (loading) {
    return <div style={{ height: '100vh', backgroundColor: 'white' }}>Loading...</div>;
  }

  return (
    <Router>
      {/* Only show Navbar if user is logged in */}
      {user && <Navbar />} 
      
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" />} 
        />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;