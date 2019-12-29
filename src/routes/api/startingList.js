import express from 'express';

import Registration from '../../models/Registration';
import CompetitionClass from '../../models/CompetitionClass';

const router = express.Router();

// @route   GET api/starting-list
// @desc    Get starting list of registered pilots
// @access  Public
router.get('/', async (req, res) => {
    const registrations = await Registration.find({})
        .populate('user', '-password')
        .populate(['glider.gliderType']);

    const simplifiedRegistrations = registrations.map((registration) => {
        return {
            _id: registration._id,
            fullName: `${registration.user.name} ${registration.user.surname}`,
            birthDate: registration.birthDate,
            aeroclub: registration.aeroclub,
            startNumber: registration.glider.startNumber,
            gliderType: `${registration.glider.gliderType.name} (${registration.glider.gliderType.index})`,
            registrationNumber: registration.glider.registrationNumber,
            paid: registration.paid,
            competitionClass: registration.competitionClass
        };
    });

    const classes = await CompetitionClass.find({});

    const startingList = classes.map((one) => {
        return {
            _id: one._id,
            name: one.name,
            // https://stackoverflow.com/questions/11637353/comparing-mongoose-id-and-strings
            registrations: simplifiedRegistrations.filter((registration) =>
                registration.competitionClass._id.equals(one._id)
            )
        };
    });

    res.json(startingList);
});

export default router;
