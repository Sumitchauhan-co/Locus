import authModel from '../models/auth.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const username = req.body.username.split(/\s+/).join('_').trim();

        const isUserExists = await authModel.findOne({
            $or: [{ username }, { email }],
        });

        if (isUserExists) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await authModel.create({
            username,
            email,
            password: hash,
        });

        const accessToken = jwt.sign(
            {
                id: user._id,
            },
            process.env.ACCESS_SECRET,
            { expiresIn: process.env.ACCESS_SECRET_EXPIRY || '1d' },
        );

        const refreshToken = jwt.sign(
            {
                id: user._id,
            },
            process.env.REFRESH_SECRET,
            { expiresIn: process.env.REFRESH_SECRET_EXPIRY || '7d' },
        );

        user.refreshToken = refreshToken;
        await user.save();

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        };

        res.cookie('refreshToken', refreshToken, cookieOptions);

        res.status(201).json({
            message: 'User created successfully',
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'User failed to register' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await authModel.findOne({
            $or: [{ username }, { email }],
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found, invalid email or username',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' });
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
            },
            process.env.ACCESS_SECRET,
            { expiresIn: process.env.ACCESS_SECRET_EXPIRY || 'id' },
        );

        const refreshToken = jwt.sign(
            {
                id: user._id,
            },
            process.env.REFRESH_SECRET,
            { expiresIn: process.env.REFRESH_SECRET_EXPIRY || '7d' },
        );

        const cookiesOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        };

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, cookiesOptions);

        res.status(200).json({
            message: 'User logged in successfully',
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'User failed to logged in' });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({ message: 'No refresh token' });
        }

        const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

        const user = await authModel.findById(decoded.id);

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign(
            { id: user._id },
            process.env.ACCESS_SECRET,
            { expiresIn: process.env.ACCESS_SECRET_EXPIRY || '1d' },
        );

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'Token expired or invalid' });
    }
};

const logoutUser = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (token) {
            await authModel.findOneAndUpdate(
                { refreshToken: token },
                { $unset: { refreshToken: 1 } },
            );
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'User failed to log out' });
    }
};

const getUser = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User fetched successfully',
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to get user' });
    }
};

export default {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getUser,
};
