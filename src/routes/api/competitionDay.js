import express from 'express';

import admin from '../../middleware/admin';
import CompetitionDay from '../../models/CompetitionDay';

const router = express.Router();

// @route   POST api/days
// @desc    Create a competition day
// @access  Admin
router.post('/', admin, async (req, res) => {
    const { name, date, task } = req.body;
    // Simple validation
    if (!name || !date) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const newCompetitionDay = new CompetitionDay({
        name,
        date,
        task
    });

    const savedCompetitionDay = await newCompetitionDay.save();

    res.status(201).json(savedCompetitionDay);
});

// @route   GET api/days
// @desc    Get all competition days
// @access  Public
router.get('/', async (req, res) => {
    const CompetitionDays = await CompetitionDay.find({}).sort('date');

    res.json(CompetitionDays);
});

// @route   PUT api/days/:id
// @desc    Update competition day
// @access  Admin
router.put('/:id', admin, async (req, res) => {
    const { id } = req.params;
    const { task } = req.body;

    if (!task) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    try {
        const competitionDay = await CompetitionDay.findById(id);
        if (!competitionDay) {
            return res.status(404).json({ msg: 'This competition day does not exist' });
        }
        competitionDay.task = task;
        try {
            await competitionDay.save();
            return res.json(competitionDay);
        } catch (e) {
            return res.status(400).json({ msg: 'Please enter valid task enum' });
        }
    } catch (e) {
        return res.status(404).json({ msg: e.message });
    }
});

export default router;
