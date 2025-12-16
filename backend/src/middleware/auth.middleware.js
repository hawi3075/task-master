const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Get token from header (using the standard 'x-auth-token' header)
    const token = req.header('x-auth-token');

    // 2. Check if no token
    if (!token) {
        return res.status(401).json({ error: 'Authorization denied. No token provided.' });
    }

    // 3. Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the user ID from the token payload to the request object
        req.userId = decoded.id; 
        
        next(); // Proceed to the secured route handler

    } catch (e) {
        res.status(401).json({ error: 'Token is not valid.' });
    }
};