import express from 'express';
import authController from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const route = express.Router();

route.get('/user', authMiddleware, authController.getUser);

route.post('/register', authController.registerUser);

route.post('/login', authController.loginUser);

route.post('/refresh', authController.refreshAccessToken);

route.post('/logout', authController.logoutUser);

export default route;
