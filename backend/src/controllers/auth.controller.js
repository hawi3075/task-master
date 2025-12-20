import db from '../config/db.config.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// --- REGISTER FUNCTION ---
export const register = async (req, res) => {
    // We now correctly pull 'username' from the request body
    const { username, email, password } = req.body; 
    
    try {
        // Check if user already exists
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // INSERT includes 'username' to satisfy the NOT NULL constraint in your DB
        const newUser = await db.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, password_hash]
        );

        const user = newUser.rows[0];
        
        // Generate Token
        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '1h' }
        );
        
        // Return success with user data
        res.status(201).json({ 
            token, 
            user: { id: user.id, username: user.username, email: user.email } 
        });

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ error: 'Registration failed: ' + err.message });
    }
};

// --- LOGIN FUNCTION ---
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userQuery = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userQuery.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid Credentials.' });
        }
        
        const user = userQuery.rows[0];

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Credentials.' });
        }

        // Generate Token
        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '1h' }
        );
        
        // Return username so the frontend Dashboard can display it
        res.json({ 
            token, 
            user: { id: user.id, username: user.username, email: user.email } 
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: 'Login failed: ' + err.message });
    }
};