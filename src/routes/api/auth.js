import express from 'express';

import User from '../../models/User';
import ResetPassword from '../../models/ResetPassword';
import auth from '../../middleware/auth';
import resetPassword from '../../middleware/resetPassword';
import { checkPassword, generateToken, getToken, hashPassword } from '../../lib/auth';
import { sendPasswordResetCompleteEmail, sendResetPasswordEmail } from '../../services/email';

const router = express.Router();

// @route   POST api/auth
// @desc    Auth user
// @access  Public
router.post('/', async (req, res) => {
    const { email, password } = req.body;
    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) return res.status(400).json({ msg: 'User does not exist' });

    const isMatch = await checkPassword(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const { id, name, surname, admin } = user;

    const token = await getToken(id);

    res.json({
        token,
        user: {
            id,
            name,
            surname,
            email,
            admin
        }
    });
});

// @route   POST api/auth/change-password
// @desc    Change password for provided user
// @access  Private
router.post('/change-password', auth, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    // Simple validation
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ msg: 'User does not exist' });

    const isMatch = await checkPassword(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid old password' });

    user.password = await hashPassword(newPassword);
    const { id, name, surname, email, admin } = await user.save();
    const token = await getToken(id);
    return res.status(200).json({
        token,
        user: {
            id,
            name,
            surname,
            email,
            admin
        }
    });
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');

    return res.json(user);
});

// @route   POST api/auth/reset-password
// @desc    Initial password reset
// @access  Public
router.post('/reset-password', async (req, res) => {
    const { email } = req.body;
    // Simple validation
    if (!email) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: 'User does not exist' });

    const token = await generateToken();

    const newResetPassword = new ResetPassword({
        user,
        token
    });

    await newResetPassword.save();

    await sendResetPasswordEmail(user.email, token);

    return res.status(200).json({ msg: 'Email sent' });
});

// @route   POST api/auth/reset-password/valid
// @desc    Check if token is valid
// @access  Private
router.post('/reset-password/valid', resetPassword, async (req, res) => {
    return res.status(200).json({ msg: 'Token is valid' });
});

// @route   POST api/auth/reset-password/reset
// @desc    Set a new password
// @access  Private
router.post('/reset-password/reset', resetPassword, async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const resetPw = await ResetPassword.findOne({ token: req.resetPasswordToken });

    const user = await User.findById(resetPw.user);

    user.password = await hashPassword(password);
    resetPw.completed = true;

    user.save();
    resetPw.save();

    sendPasswordResetCompleteEmail(user.email);

    return res.status(200).json({ msg: 'Password was successfully changed' });
});

export default router;
