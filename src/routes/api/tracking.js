import express from 'express';

import admin from '../../middleware/admin';
import CompetitionDay from '../../models/CompetitionDay';
import CompetitionClass from '../../models/CompetitionClass';
import Tracking from '../../models/Tracking';

const router = express.Router();

const sortTracking = (first, second) => {
    if (first.competitionClass.name < second.competitionClass.name) {
        return -1;
    }
    if (first.competitionClass.name > second.competitionClass.name) {
        return 1;
    }
    return 0;
};

// @route   POST api/tracking/:day/:class
// @desc    Add a taskUrl to competitionClass and competitionDay
// @access  Admin
router.post('/:day/:compClass', admin, async (req, res) => {
    const { day, compClass } = req.params;
    const { taskUrl } = req.body;

    if (!day || !compClass || !taskUrl) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const competitionDay = await CompetitionDay.findById(day);

    if (!competitionDay) {
        return res.status(400).json({ msg: 'Invalid competition day' });
    }

    const competitionClass = await CompetitionClass.findById(compClass);

    if (!competitionClass) {
        return res.status(400).json({ msg: 'Invalid competition class' });
    }

    const newTracking = new Tracking({
        day: competitionDay,
        competitionClass,
        taskUrl
    });

    const savedTracking = await newTracking.save();

    res.status(201).json(savedTracking);
});

// @route   GET api/tracking/:day
// @desc    Get tracking of all classes for competition day
// @access  Public
router.get('/:day', async (req, res) => {
    const { day } = req.params;
    // Simple validation
    if (!day) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const competitionDay = await CompetitionDay.findById(day);
    if (!competitionDay) {
        return res.status(400).json({ msg: 'This competition day does not exist' });
    }

    const trackings = await Tracking.find({ day: competitionDay }).populate(['day', 'competitionClass']);

    res.status(200).json(trackings.sort(sortTracking));
});

export default router;
