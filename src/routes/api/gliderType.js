import express from 'express';

import admin from '../../middleware/admin';
import GliderType from '../../models/GliderType';

const router = express.Router();

// @route   POST api/glidertypes
// @desc    Create a glider type
// @access  Admin
router.post('/', admin, async (req, res) => {
    const { name, index } = req.body;
    // Simple validation
    if (!name || !index) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const newGliderType = new GliderType({
        name,
        index
    });

    const savedGliderType = await newGliderType.save();

    res.status(201).json(savedGliderType);
});

// @route   GET api/glidertypes
// @desc    Get all glider types
// @access  Public
router.get('/', async (req, res) => {
    const gliderTypes = await GliderType.find({}).sort('name');

    res.json(gliderTypes);
});

export default router;
