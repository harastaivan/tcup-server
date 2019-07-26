import express from 'express';
import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// @route   POST api/users
// @desc    Register new user
// @access  Public
router.post('/', (req, res) => {
	const { name, surname, email, password } = req.body;
	// Simple validation
	if (!name || !surname || !email || !password) {
		return res.status(400).json({ msg: 'Please enter all fields' });
	}

	User.findOne({ email }).then((user) => {
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
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) throw err;
				newUser.password = hash;
				newUser.save().then(({ id, name, surname, email }) => {
					jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
						if (err) throw err;
						res.json({
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
	});
});

export default router;
