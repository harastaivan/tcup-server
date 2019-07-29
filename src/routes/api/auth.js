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

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, (req, res) => {
	User.findById(req.user.id).select('-password').then((user) => res.json(user));
});

export default router;
