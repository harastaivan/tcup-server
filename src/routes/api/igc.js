import express from 'express';

import Registration from '../../models/Registration';
import CompetitionDay from '../../models/CompetitionDay';
import igc from '../../services/igc';
import IgcFile from '../../models/IgcFile';

const router = express.Router();

const mapRegistrationForForm = (registration) => {
    return {
        _id: registration._id,
        name: registration.user.name,
        surname: registration.user.surname,
        startNumber: registration.glider.startNumber
    };
};

// @route   POST api/igc
// @desc    Upload IGC file
// @access  Public
router.post('/', igc.single('igc'), async (req, res) => {
    try {
        const { pilot, day } = req.body;

        if (!pilot || !day) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        const registration = await Registration.findById(pilot);

        if (!registration) {
            return res.status(400).json({ msg: 'Invalid pilot' });
        }

        const competitionDay = await CompetitionDay.findById(day);

        if (!competitionDay) {
            return res.status(400).json({ msg: 'Invalid day' });
        }

        const newIgcFile = new IgcFile({
            name: req.file.key,
            originalName: req.file.originalname,
            path: req.file.location,
            mimetype: req.file.mimetype,
            size: req.file.size,
            day: competitionDay,
            pilot: registration
        });

        const savedIgcFile = await newIgcFile.save();

        res.status(201).json(savedIgcFile);
    } catch (e) {
        res.status(500).json({ msg: 'Something went wrong', error: e.message });
    }
});

// @route   GET api/igc/form
// @desc    Get form data for igc
// @access  Public
router.get('/form', async (req, res) => {
    const registrations = await Registration.find({}).populate('user', '-password');

    res.status(200).json(registrations.map(mapRegistrationForForm));
});

export default router;
