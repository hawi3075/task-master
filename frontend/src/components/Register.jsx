import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // DIRECT CALL to ensure names match backend exactly
            await axios.post('https://task-master-dzpm.onrender.com/api/auth/register', {
                username: username,
                email: email,
                password: password
            });
            
            alert("Registration successful!");
            navigate('/login');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Check if username/email already exists");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Create Account</h2>
                
                <input 
                    type="text" placeholder="Username" required
                    className="w-full p-2 mb-4 border rounded"
                    value={username} onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                    type="email" placeholder="Email" required
                    className="w-full p-2 mb-4 border rounded"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                />
                <div style={{ position: 'relative' }}>
                    <input 
                        type={showPassword ? "text" : "password"} placeholder="Password" required
                        className="w-full p-2 mb-6 border rounded"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none' }}>
                        {showPassword ? "👁️" : "🙈"}
                    </button>
                </div>
                <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 font-bold">
                    Register Now
                </button>
                <p className="mt-4 text-center">
                    <Link to="/login" className="text-blue-600">Back to Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;