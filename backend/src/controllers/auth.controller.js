import db from '../config/db.config.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
    const { email, password } = req.body;
    try {

        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists.' });
        }

      
        const salt = await bcrypt.genSalt(10);

        const password_hash = await bcrypt.hash(password, salt);


        const newUser = await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, password_hash]
        );

       
        const user = newUser.rows[0];
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        
        res.status(201).json({ token, user: { id: user.id, email: user.email } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed: ' + err.message });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
     
        const userQuery = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userQuery.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid Credentials.' });
        }
        
        const user = userQuery.rows[0];


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Credentials.' });
        }

      
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        
        res.json({ token, user: { id: user.id, email: user.email } });

    } catch (err) {
        res.status(500).json({ error: 'Login failed: ' + err.message });
    }
};