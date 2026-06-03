import authModel from '../models/auth.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import qs from 'qs';
import { verifyToken } from '../utils/verifyToken.js';

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const username = req.body.username.trim().split(/\s+/).join(' ');

        const isValid = /^[a-zA-Z0-9_\- .@]*$/.test(username);

        if (!isValid) {
            return res.status(400).json({
                message:
                    'Invalid username. You can only use letters, numbers, and the following symbols: _ - . @',
            });
        }

        const existingUser = await authModel.findOne({ email });

        if (existingUser) {
            if (existingUser.username === username) {
                return res
                    .status(409)
                    .json({ message: 'Username already taken' });
            }

            if (existingUser.email === email) {
                return res.status(409).json({
                    message:
                        'Registration failed. Please check your details or try logging in.',
                });
            }
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

        const user = await authModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found, invalid email or password',
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

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, cookieOptions);

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
        if (req.isAuthenticated && req.isAuthenticated()) {
            return res.status(200).json({
                message: 'Session is active, no refresh needed',
            });
        }

        const token = req.cookies.refreshToken;
        if (!token)
            return res.status(401).json({ message: 'No refresh token' });

        const decoded = verifyToken(token, 'refresh');

        let user;
        if (decoded.rawToken) {
            user = await authModel.findOne({ refreshToken: decoded.rawToken });
        } else {
            const userId = decoded.sub || decoded.id;
            user = await authModel.findById(userId);
        }

        if (!user) {
            return res.status(403).json({ message: 'User identity missing' });
        }

        const newAccessToken = jwt.sign(
            { id: user._id },
            process.env.ACCESS_SECRET,
            { expiresIn: '1d' },
        );

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('Refresh Controller Error:', error.message);
        return res.status(403).json({ message: 'Token expired or invalid' });
    }
};

const logoutUser = async (req, res) => {
    try {
        const idToken = req.cookies.idToken;
        const currentRefreshToken = req.cookies.refreshToken;

        if (currentRefreshToken) {
            await authModel.findOneAndUpdate(
                { refreshToken: currentRefreshToken },
                { $unset: { refreshToken: 1 } },
            );
        }

        res.clearCookie('refreshToken', cookieOptions);
        res.clearCookie('idToken', cookieOptions);

        const centralServerBase =
            process.env.PROTOAUTH_SERVER_URL || 'http://localhost:3000';

        const centralLogoutUrl =
            `${centralServerBase}/o/authenticate/signout` +
            `?id_token=${idToken || ''}` +
            `&redirect_uri=${encodeURIComponent(process.env.PROTOAUTH_REDIRECT_URI || 'http://localhost:5175')}`;

        return res.status(200).json({
            message: 'Local session cleared successfully.',
            redirectUrl: centralLogoutUrl,
        });
    } catch (error) {
        console.error('Logout error encountered:', error);
        return res.status(500).json({ message: 'User failed to log out' });
    }
};

const getUser = async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            return res.status(200).json({
                message: 'User fetched via Google Session',
                user: req.user,
            });
        }

        const token = req.cookies.refreshToken;
        if (token) {
            const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
            const user = await authModel.findById(decoded.id);
            if (user) {
                return res.status(200).json({
                    message: 'User fetched via JWT',
                    user,
                });
            }
        }

        res.status(401).json({ message: 'No active session or token' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const callback = async (req, res) => {
    const { code } = req.body;

    try {
        const tokenRequest = {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.PROTOAUTH_REDIRECT_URI,
            client_id: process.env.PROTOAUTH_CLIENT_ID,
            client_secret: process.env.PROTOAUTH_CLIENT_SECRET,
        };

        const response = await axios.post(
            `${process.env.PROTOAUTH_SERVER_URL}/o/token` ||
                'http://localhost:3000/o/token',
            qs.stringify(tokenRequest),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );

        const { access_token, refresh_token, id_token } = response.data.data;

        const decodedIdentity = verifyToken(id_token, 'access');

        const user = await authModel.findOneAndUpdate(
            {
                $or: [
                    { authId: decodedIdentity.sub },
                    { email: decodedIdentity.email },
                ],
            },
            {
                authId: decodedIdentity.sub,
                email: decodedIdentity.email,
                username: [
                    decodedIdentity.firstName,
                    decodedIdentity.lastName,
                ].join(' '),
                refreshToken: refresh_token,
            },
            { upsert: true, returnDocument: 'after' },
        );

        res.cookie('refreshToken', refresh_token, cookieOptions);

        res.cookie('idToken', id_token, cookieOptions);

        res.json({
            message: 'Tokens retrieved',
            _id: id_token,
            accessToken: access_token,
        });
    } catch (error) {
        console.error('Auth Server refused exchange:', error.response?.data);
        res.status(500).json({ error: 'Could not verify identity' });
    }
};

const userinfo = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No access token provided' });
    }

    const accessToken = authHeader.split(' ')[1];

    try {
        const response = await axios.get('http://localhost:3000/o/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return res.json({
            success: true,
            user: response.data.data,
        });
    } catch (error) {
        if (error.response) {
            console.error('Auth Server Error:', error.response.data);
            return res.status(error.response.status).json(error.response.data);
        }

        console.error('Connection to Auth Server failed:', error.message);
        return res
            .status(500)
            .json({ error: 'Failed to fetch user info from Auth Server' });
    }
};

export default {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getUser,
    callback,
    userinfo,
};
