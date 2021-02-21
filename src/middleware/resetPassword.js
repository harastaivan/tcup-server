import { verifyToken } from '../lib/auth';
import ResetPassword from '../models/ResetPassword';

const resetPassword = async (req, res, next) => {
    const { token } = req.body;

    // Check for token
    if (!token) return res.status(401).json({ msg: 'No reset password token' });

    try {
        // Verify token
        verifyToken(token);

        const resetPw = await ResetPassword.findOne({ token });
        if (!resetPw) {
            return res.status(404).json({ msg: 'No reset password token found' });
        }
        if (resetPw.completed) return res.status(400).json({ msg: 'This token was already used to reset password' });
        req.resetPasswordToken = token;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
};

export default resetPassword;
