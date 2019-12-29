import jwt from 'jsonwebtoken';

import config from '../../config';
import User from '../models/User';

const admin = async (req, res, next) => {
    const token = req.header('x-auth-token');

    // Check for token
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        // Verify token
        const decoded = jwt.verify(token, config.JWT_SECRET);

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
