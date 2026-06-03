import authModel from '../models/auth.model.js';
import { verifyToken } from '../utils/verifyToken.js';

export const authMiddleware = async (req, res, next) => {
    try {
        if (req.isAuthenticated && req.isAuthenticated()) {
            return next();
        }

        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }

        const decoded = verifyToken(token, 'access');
        const userId = decoded.sub || decoded.id;

        const user = await authModel
            .findOne({
                $or: [
                    { _id: userId.length === 24 ? userId : null },
                    { email: decoded.email },
                ],
            })
            .select('-password');

        if (!user) {
            return res
                .status(401)
                .json({ message: 'User not found in Locus database' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        return res.status(401).json({ message: 'Token expired or invalid' });
    }
};
