import authModel from '../models/auth.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(req.body);
        

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

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
        );

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        };

        res.cookie('token', token, options);

        console.log(user);
        

        res.status(201).json({
            message: 'User created successfully',
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
            res.status(404).json({
                message: 'User not found, invalid email or password',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
        );

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        };

        res.cookie('token', token, options);

        res.status(200).json({
            message: 'User logged in successfully',
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

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });

        res.status(200).json({ message: 'User logout successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'user failed to logged out' });
    }
};

const getUser = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorised' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await authModel.findById(decoded.id).select('-password');

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
        message: 'User get successfully',
        user: user,
    });
};

export default { registerUser, loginUser, logoutUser, getUser };
