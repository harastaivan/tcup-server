import express from 'express';

import admin from '../../middleware/admin';
import AccomodationType from '../../models/AccomodationType';

const router = express.Router();

// @route   POST api/accomodationtypes
// @desc    Create a accomodation type
// @access  Admin
router.post('/', admin, async (req, res) => {
    const { name } = req.body;
    // Simple validation
    if (!name) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const newAccomodationType = new AccomodationType({
        name
    });

    const savedAccomodationType = await newAccomodationType.save();

    res.status(201).json(savedAccomodationType);
});

// @route   GET api/accomodationtypes
// @desc    Get all accomodation types
// @access  Public
router.get('/', async (req, res) => {
    const accomodationTypes = await AccomodationType.find({}).sort('name');

    res.json(accomodationTypes);
});

export default router;
