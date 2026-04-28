import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import postRouter from './routes/post.route.js';
import contactRouter from './routes/contact.route.js';
import authRouter from './routes/auth.route.js';
import locationRouter from './routes/location.route.js';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import authModel from './models/auth.model.js';

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
);

app.use(express.json({ limit: '25mb' }));

app.use(cookieParser());

// OAuth config

passport.use(
    new GoogleStrategy.Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback',
            accessType: 'offline',
            prompt: 'consent',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await authModel.findOne({ googleId: profile.id });

                if (!user) {
                    user = new authModel({
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                    });

                    await user.save({ validateBeforeSave: false });
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        },
    ),
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            collectionName: 'sessions',
        }),
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        },
    }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use('/api/post', postRouter);

app.use('/api/contact', contactRouter);

app.use('/api/auth', authRouter);

app.use('/api/location', locationRouter);

app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.status(500).json({ message: err.message });
});

// ---------- OAuth -------------

// Connect
app.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    }),
);

// Callback
app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/login' }),
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_URL}/`);
    },
);

export default app;
