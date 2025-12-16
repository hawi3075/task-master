// frontend/src/AuthForm.jsx (Simplified for guide)
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const API_BASE = 'http://localhost:5000/api/auth';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isLogin ? `${API_BASE}/login` : `${API_BASE}/register`;
        
        try {
            const response = await axios.post(endpoint, { email, password });
            
            // On success, call the login function from AuthContext
            login(response.data.token, response.data.user);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
                {isLogin ? 'Login' : 'Register'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Input Fields (Email, Password) */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                />

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-150"
                >
                    {isLogin ? 'Log In' : 'Sign Up'}
                </button>
            </form>

            {/* Toggle Button */}
            <div className="mt-6 text-center">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                </button>
            </div>
        </div>
    );
};

export default AuthForm;