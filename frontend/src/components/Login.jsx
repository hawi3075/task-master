import React, { useState } from 'react';
// 1. Import the live API function
import { loginUser } from '../api'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // State for the "eye" property
    const [showPassword, setShowPassword] = useState(false);
    
    const { login } = useAuth(); 
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // 2. Uses the Render URL defined in your api.js
            const res = await loginUser({ email, password });
            
            if (res.data.token && res.data.user) {
                login(res.data.token, res.data.user); 
                navigate('/');
            }
        } catch (err) {
            alert(err.response?.data?.error || "Invalid login credentials");
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.form}>
                <h2 style={styles.title}>TaskMaster Login</h2>
                
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    style={styles.input} 
                    required 
                />

                {/* Password Input with Eye Toggle */}
                <div style={{ position: 'relative' }}>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        style={styles.input} 
                        required 
                    />
                    
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={styles.eyeBtn}
                    >
                        {showPassword ? "👁️" : "🙈"}
                    </button>
                </div>

                <button type="submit" style={styles.button}>Login</button>
                <p style={styles.footer}>
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </form>
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' },
    form: { backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
    title: { textAlign: 'center', marginBottom: '20px', color: '#1f2937' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #d1d5db', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    footer: { textAlign: 'center', marginTop: '15px', fontSize: '14px' },
    eyeBtn: {
        position: 'absolute',
        right: '10px',
        top: '12px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px'
    }
};

export default Login;