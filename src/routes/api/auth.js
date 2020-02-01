import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import config from '../../../config';
import User from '../../models/User';
import auth from '../../middleware/auth';

const router = express.Router();

// @route   POST api/auth
// @desc    Auth user
// @access  Public
router.post('/', (req, res) => {
    const { email, password } = req.body;
    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findOne({ email }).then((user) => {
        if (!user) return res.status(400).json({ msg: 'User does not exist' });

        // Validate password
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
            const { id, name, surname, email, admin } = user;
            jwt.sign({ id }, config.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                if (err) throw err;
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
        });
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

    // Validate password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid old password' });

    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newPassword, salt, async (err, hash) => {
            if (err) throw err;
            user.password = hash;
            const { id, name, surname, email, admin } = await user.save();
            jwt.sign({ id }, config.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                if (err) throw err;
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
        });
    });
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then((user) => res.json(user));
});

export default router;
