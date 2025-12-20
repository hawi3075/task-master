import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    // 1. Get the token from the header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 2. If no token, return 401 (Unauthorized)
    if (!token) {
        return res.status(401).json({ error: "Access Denied: No token provided" });
    }

    // 3. Verify the token using your secret key
    // Added a fallback 'secret' to match your login/register logic
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
        if (err) {
            console.error("JWT Verification Error:", err.message);
            return res.status(403).json({ error: "Invalid or Expired Token" });
        }
        
        // 4. Attach the user payload to the request
        // This ensures req.user.id is available for your database queries
        req.user = user;
        next();
    });
};