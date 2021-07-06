import { verifyToken } from '../lib/auth';
import User from '../models/User';
import { getAuthToken } from './token';

const admin = async (req, res, next) => {
    const token = getAuthToken(req);

    // Check for token
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        // Verify token
        const decoded = verifyToken(token);

        // Add user from payload
        req.user = decoded;
        const user = await User.findById(req.user.id);
        if (!user.admin) return res.status(401).json({ msg: 'User is not admin' });
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
};

export default admin;
