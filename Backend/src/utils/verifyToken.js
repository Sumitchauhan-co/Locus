import jwt from 'jsonwebtoken';

export const verifyToken = (token, type = 'access') => {
    if (!token) throw new Error('Token missing');
    if (!token.includes('.')) return { id: null, rawToken: token };

    try {
        const localSecret =
            type === 'access'
                ? process.env.ACCESS_SECRET
                : process.env.REFRESH_SECRET;
        return jwt.verify(token, localSecret, { algorithms: ['HS256'] });
    } catch (symError) {
        try {
            const publicKey = process.env.PROTOAUTH_SERVER_PUBLIC_KEY.replace(
                /\\n/g,
                '\n',
            );
            return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        } catch (asymError) {
            throw new Error(`Invalid ${type} token signature`);
        }
    }
};
