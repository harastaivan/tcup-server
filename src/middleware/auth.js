import { verifyToken } from '../lib/auth';
import { getAuthToken } from './token';

const auth = (req, res, next) => {
    const token = getAuthToken(req);

    // Check for token
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        // Verify token
        const decoded = verifyToken(token);

        // Add user from payload
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
};

export default auth;
