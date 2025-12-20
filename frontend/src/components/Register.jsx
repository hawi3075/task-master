import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api'; 

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Ensures username, email, and password are all saved in state
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sends the data to your live Render backend
            await registerUser(formData);
            alert("Registration successful! You can now login.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Registration failed. Try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Register</h2>
                
                <input 
                    type="text" name="username" placeholder="Username" required
                    className="w-full p-2 mb-4 border rounded"
                    value={formData.username} onChange={handleChange}
                />
                <input 
                    type="email" name="email" placeholder="Email" required
                    className="w-full p-2 mb-4 border rounded"
                    value={formData.email} onChange={handleChange}
                />
                <div style={{ position: 'relative' }}>
                    <input 
                        type={showPassword ? "text" : "password"} name="password" placeholder="Password" required
                        className="w-full p-2 mb-6 border rounded"
                        value={formData.password} onChange={handleChange}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
                        {showPassword ? "👁️" : "🙈"}
                    </button>
                </div>
                <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 font-bold">
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default Register;