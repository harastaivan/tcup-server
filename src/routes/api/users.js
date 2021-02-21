import express from 'express';
import User from '../../models/User';
import auth from '../../middleware/auth';
import { getToken, hashPassword } from '../../lib/auth';

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

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const newUser = new User({
        name,
        surname,
        email: email.toLowerCase(),
        password: await hashPassword(password)
    });

    const { id, admin } = await newUser.save();

    const token = await getToken(id);

    return res.status(201).json({
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

// @route   PUT api/users
// @desc    Changes user info
// @access  Private
router.put('/', auth, async (req, res) => {
    const { name, surname, email } = req.body;
    if (!name || !surname || !email) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    const user = await User.findById(req.user.id).select('-password');
    user.name = name;
    user.surname = surname;
    user.email = email.toLowerCase();
    const savedUser = await user.save();
    return res.json(savedUser);
});

export default router;
