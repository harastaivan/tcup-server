import express from 'express';

import admin from '../../middleware/admin';
import CompetitionClass from '../../models/CompetitionClass';

const router = express.Router();

// @route   POST api/classes
// @desc    Create a region
// @access  Admin
router.post('/', admin, async (req, res) => {
    try {
        const { name } = req.body;
        // Simple validation
        if (!name) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        const newCompetitionClass = new CompetitionClass({
            name
        });

        const savedCompetitionClass = await newCompetitionClass.save();

        res.status(201).json(savedCompetitionClass);
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Something went wrong' });
    }
});

// @route   GET api/classes
// @desc    Get all classes
// @access  Public
router.get('/', async (req, res) => {
    const competitionClasses = await CompetitionClass.find({}).sort('name');

    res.json(competitionClasses);
});

export default router;
