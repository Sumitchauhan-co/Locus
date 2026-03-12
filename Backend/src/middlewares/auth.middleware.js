import jwt from 'jsonwebtoken';
import authModel from '../models/auth.model.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorised' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await authModel.findById(decoded.id).select('-password');

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export { authMiddleware };
