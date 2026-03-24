import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import postRouter from './routes/post.route.js';
import contactRouter from './routes/contact.route.js';
import authRouter from './routes/auth.route.js';
import locationRouter from "./routes/location.route.js"

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
);
app.use(express.json());

app.use(cookieParser())

app.use('/api/post', postRouter);

app.use('/api/contact', contactRouter);

app.use('/api/auth', authRouter);

app.use('/api/location', locationRouter)

export default app;
