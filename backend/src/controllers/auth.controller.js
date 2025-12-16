const db = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- Register Controller ---
exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Check if user already exists
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 3. Save the new user to the database
        const newUser = await db.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [email, password_hash]
        );

        // 4. Create and send JWT
        const user = newUser.rows[0];
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(201).json({ token, user: { id: user.id, email: user.email } });

    } catch (err) {
        res.status(500).json({ error: 'Registration failed: ' + err.message });
    }
};

// --- Login Controller ---
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Find user by email
        const userQuery = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userQuery.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid Credentials.' });
        }
        
        const user = userQuery.rows[0];

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Credentials.' });
        }

        // 3. Create and send JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ token, user: { id: user.id, email: user.email } });

    } catch (err) {
        res.status(500).json({ error: 'Login failed: ' + err.message });
    }
};