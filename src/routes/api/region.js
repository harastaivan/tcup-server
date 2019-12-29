import express from 'express';

import admin from '../../middleware/admin';
import Region from '../../models/Region';

const router = express.Router();

// @route   POST api/regions
// @desc    Create a region
// @access  Admin
router.post('/', admin, async (req, res) => {
    const { name } = req.body;
    // Simple validation
    if (!name) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const newRegion = new Region({
        name
    });

    const savedRegion = await newRegion.save();

    res.status(201).json(savedRegion);
});

// @route   GET api/regions
// @desc    Get all regions
// @access  Public
router.get('/', async (req, res) => {
    const regions = await Region.find({}).sort('name');

    res.json(regions);
});

export default router;
