import { rateLimit } from 'express-rate-limit';

export const locationLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    limit: 10,

    keyGenerator: (req) => {
        return req.user?.id || req.ip;
    },

    standardHeaders: true,
    legacyHeaders: false,
    validate: { default: false },

    handler: (_, res) => {
        res.status(429).json({
            errorMessage:
                "You've reached your daily limit, please try again later!",
        });
    },
});
