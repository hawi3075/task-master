import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api'; 

const Register = () => {
    // Initializing with empty strings ensures no 'null' values are sent
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        password: '' 
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // This function ensures the state updates correctly for each field
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sending the formData object to your Render backend
            await registerUser(formData); 
            alert("Registration successful! You can now login.");
            navigate('/login');
        } catch (err) {
            console.error("Registration Error:", err.response?.data || err.message);
            alert(err.response?.data?.error || "Registration failed. Try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Register for TaskMaster</h2>
                
                {/* Username Field - 'name' attribute must match 'username' */}
                <input 
                    type="text" 
                    placeholder="Username" 
                    name="username"
                    required
                    className="w-full p-2 mb-4 border rounded"
                    value={formData.username}
                    onChange={handleChange}
                />

                <input 
                    type="email" 
                    placeholder="Email" 
                    name="email"
                    required
                    className="w-full p-2 mb-4 border rounded"
                    value={formData.email}
                    onChange={handleChange}
                />

                <div style={{ position: 'relative' }}>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password" 
                        name="password"
                        required
                        className="w-full p-2 mb-6 border rounded"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '10px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '18px'
                        }}
                    >
                        {showPassword ? "👁️" : "🙈"}
                    </button>
                </div>

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