import express from 'express';

import admin from '../../middleware/admin';
import CompetitionDay from '../../models/CompetitionDay';
import CompetitorStatus from '../../models/CompetitorStatus';
import Registration from '../../models/Registration';

const router = express.Router();

const populateCompetitorStatus = [
    {
        path: 'pilot',
        populate: {
            path: 'user',
            select: '-password'
        }
    },
    {
        path: 'pilot',
        populate: {
            path: 'glider.gliderType'
        }
    }
];

const sortByStartNumber = (first, second) => {
    if (first.pilot.glider.startNumber < second.pilot.glider.startNumber) {
        return -1;
    }
    if (first.pilot.glider.startNumber > second.pilot.glider.startNumber) {
        return 1;
    }
    return 0;
};

const filterStatus = (status) => ({
    _id: status._id,
    name: status.pilot.user.name,
    surname: status.pilot.user.surname,
    glider: status.pilot.glider,
    status: status.status,
    day: status.day
});

// @route   POST api/competitorstatuses
// @desc    Create competitor statuses for competition day (if they already exists, skip)
// @access  Admin
router.post('/', admin, async (req, res) => {
    const { day } = req.body;

    if (!day) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const competitionDay = await CompetitionDay.findById(day);
    if (!competitionDay) {
        return res.status(400).json({ msg: 'This competition day does not exist' });
    }

    const pilots = await Registration.find({});

    for (const pilot of pilots) {
        const existing = await CompetitorStatus.findOne({ day: competitionDay, pilot });
        if (existing) {
            continue;
        }
        const competitorStatus = new CompetitorStatus({ day: competitionDay, pilot });
        await competitorStatus.save();
    }

    const competitorStatuses = await CompetitorStatus.find({ day: competitionDay }).populate(populateCompetitorStatus);

    res.status(201).json(competitorStatuses.sort(sortByStartNumber).map(filterStatus));
});

// @route   PUT api/competitorstatuses/:id
// @desc    Update competitor status by id
// @access  Admin
router.put('/:id', admin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        const competitorStatus = await CompetitorStatus.findById(id);

        if (!competitorStatus) {
            return res.status(400).json({ msg: 'This competitor status does not exist' });
        }

        competitorStatus.status = status;
        await competitorStatus.save();

        const newCompetitorStatus = await CompetitorStatus.findById(id).populate(populateCompetitorStatus);

        res.status(200).json(filterStatus(newCompetitorStatus));
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

// @route   GET api/competitorstatuses/:day
// @desc    Get all competitor statuses
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

    const competitorStatuses = await CompetitorStatus.find({ day: competitionDay }).populate(populateCompetitorStatus);

    res.status(200).json(competitorStatuses.sort(sortByStartNumber).map(filterStatus));
});

export default router;
