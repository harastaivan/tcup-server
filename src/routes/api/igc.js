import express from 'express';

import Registration from '../../models/Registration';
import CompetitionDay from '../../models/CompetitionDay';
import CompetitionClass from '../../models/CompetitionClass';
import igc from '../../services/igc';
import IgcFile from '../../models/IgcFile';
import admin from '../../middleware/admin';
import { getRankedStartingList } from './startingList';

const router = express.Router();

const populateIgcFile = [
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
            path: 'competitionClass'
        }
    }
];

const mapIgcFile = (igcFile) => ({
    downloaded: igcFile.downloaded,
    processed: igcFile.processed,
    _id: igcFile._id,
    name: igcFile.name,
    path: igcFile.path,
    day: igcFile.day,
    startNumber: igcFile.pilot.glider.startNumber,
    createdAt: igcFile.createdAt,
    updatedAt: igcFile.updatedAt,
    user: {
        name: igcFile.pilot.user.name,
        surname: igcFile.pilot.user.surname
    }
});

const sortRegistrationByStartNumber = (first, second) => {
    if (first.glider.startNumber < second.glider.startNumber) {
        return -1;
    }
    if (first.glider.startNumber > second.glider.startNumber) {
        return 1;
    }
    return 0;
};

const sortIgcFileByStartNumber = (first, second) => {
    if (first.pilot.glider.startNumber < second.pilot.glider.startNumber) {
        return -1;
    }
    if (first.pilot.glider.startNumber > second.pilot.glider.startNumber) {
        return 1;
    }
    return 0;
};

const sortClassByName = (first, second) => {
    if (first.name < second.name) {
        return -1;
    }
    if (first.name > second.name) {
        return 1;
    }
    return 0;
};

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

        const igcFile = await IgcFile.findOne({ name: req.file.key });

        if (igcFile) {
            igcFile.originalName = req.file.originalname;
            igcFile.path = req.file.location;
            igcFile.mimetype = req.file.mimetype;
            igcFile.size = req.file.size;
            igcFile.day = competitionDay;
            igcFile.pilot = registration;
            igcFile.updatedAt = new Date();

            const savedIgcFile = await igcFile.save();

            return res.status(200).json(savedIgcFile);
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
    const { acceptedRegistrations } = await getRankedStartingList({ populate: [], isFinal: true });

    res.status(200).json(acceptedRegistrations.sort(sortRegistrationByStartNumber).map(mapRegistrationForForm));
});

// @route   GET api/igc/:day
// @desc    Get igc files information of given day (both class)
// @access  Admin
router.get('/:day', admin, async (req, res) => {
    const { day } = req.params;

    const igcFiles = await IgcFile.find({ day }).populate(populateIgcFile);
    const competitionClasses = await CompetitionClass.find({});

    const result = competitionClasses.sort(sortClassByName).map((competitionClass) => ({
        _id: competitionClass._id,
        name: competitionClass.name,
        igcFiles: igcFiles
            .filter((igcFile) => igcFile.pilot.competitionClass._id.equals(competitionClass._id))
            .sort(sortIgcFileByStartNumber)
            .map(mapIgcFile)
    }));

    res.status(200).json(result);
});

// @route   PUT api/igc/:id
// @desc    Update downloaded or processed attributes of IgcFile
// @access  Admin
router.put('/:id', admin, async (req, res) => {
    const { id } = req.params;
    const { downloaded, processed } = req.body;

    const igcFile = await IgcFile.findById(id);

    if (downloaded !== undefined) {
        igcFile.downloaded = downloaded;
    }

    if (processed !== undefined) {
        igcFile.processed = processed;
    }

    const savedIgcFile = await igcFile.save();

    res.status(200).json(savedIgcFile);
});

export default router;
