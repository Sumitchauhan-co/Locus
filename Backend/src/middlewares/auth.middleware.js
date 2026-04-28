import jwt from 'jsonwebtoken';
import authModel from '../models/auth.model.js';

export const authMiddleware = async (req, res, next) => {
    try {
        if (req.isAuthenticated && req.isAuthenticated()) {
            return next(); 
        }

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No session or token found' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

        const user = await authModel
            .findById(decoded.id)
            .select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
        
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ message: 'Token expired or invalid' });
    }
};