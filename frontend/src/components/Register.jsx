import React, { useState } from 'react';
// 1. Import the register function from your api.js file
import { registerUser } from '../api'; 
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 2. Use the function we defined in api.js instead of axios.post('localhost...')
            await registerUser(formData);
            
            alert("Registration successful! You can now login.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            // 3. This will now show the actual error from your Render backend
            alert(err.response?.data?.error || "Registration failed. Try again.");
        }
    };
    
    // ... rest of your return code stays the same
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Register for TaskMaster</h2>
                <input 
                    type="text" placeholder="Username" required
                    className="w-full p-2 mb-4 border rounded"
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                <input 
                    type="email" placeholder="Email" required
                    className="w-full p-2 mb-4 border rounded"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <input 
                    type="password" placeholder="Password" required
                    className="w-full p-2 mb-6 border rounded"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 font-bold">
                    Create Account
                </button>
                <p className="mt-4 text-center">
                    Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;