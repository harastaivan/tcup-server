import express from 'express';
import config from '../../../config.js';
import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// @route   POST api/users
// @desc    Register new user
// @access  Public
router.post('/', async (req, res) => {
	const { name, surname, email, password } = req.body;
	// Simple validation
	if (!name || !surname || !email || !password) {
		return res.status(400).json({ msg: 'Please enter all fields' });
	}

	const user = await User.findOne({ email });
	if (user) return res.status(400).json({ msg: 'User already exists' });

	const newUser = new User({
		name,
		surname,
		email,
		password
	});

	// Create salt & hash
	bcrypt.genSalt(10, (err, salt) => {
		if (err) throw err;
		bcrypt.hash(newUser.password, salt, async (err, hash) => {
			if (err) throw err;
			newUser.password = hash;
			const { id, name, surname, email } = await newUser.save();
			jwt.sign({ id }, config.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
				if (err) throw err;
				return res.status(201).json({
					token,
					user: {
						id,
						name,
						surname,
						email
					}
				});
			});
		});
	});
});

export default router;
