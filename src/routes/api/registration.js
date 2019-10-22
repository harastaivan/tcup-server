import express from 'express';

import Registration from '../../models/Registration';
import User from '../../models/User';
import auth from '../../middleware/auth';
import AccomodationType from '../../models/AccomodationType';
import Region from '../../models/Region';
import GliderType from '../../models/GliderType';
import CompetitionClass from '../../models/CompetitionClass';

const router = express.Router();

const getUserById = async id => {
    return await Registration.findOne({ user: id })
        .populate('user', '-password')
        .populate(['region', 'competitionClass', 'glider.gliderType', 'accomodation.accomodationType']);
};

// @route   POST api/registration
// @desc    Create a registration of a user
// @access  Private
router.post('/', auth, async (req, res) => {
    const {
        isOnStartingList,
        birthDate,
        phone,
        aeroclub,
        region,
        glider,
        competitionClass,
        logger,
        accomodation,
        meals,
        note
    } = req.body;

    if (
        !phone ||
        !aeroclub ||
        !region ||
        !glider ||
        !competitionClass ||
        !logger ||
        !accomodation ||
        !glider.gliderType ||
        !glider.registrationNumber ||
        !glider.startNumber ||
        !accomodation.accomodationType
    ) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await User.findById(req.user.id).select('-password');

    if (await Registration.findOne({ user })) {
        return res.status(400).json({ msg: 'Registration already exists by this user' });
    }

    const newReg = new Registration({
        user,
        ...req.body
    });

    const savedReg = await newReg.save();

    return res.status(201).json(await getUserById(req.user.id));
});

// @route   GET api/registration
// @desc    Get registration data of a user
// @access  Private
router.get('/', auth, async (req, res) => {
    const reg = await getUserById(req.user.id);
    if (!reg) {
        return res.status(404).json({ msg: 'Registration does not exist for this user' });
    }
    return res.json(reg);
});

// @route   PUT api/registration
// @desc    Update registration of user
// @access  Private
router.put('/', auth, async (req, res) => {
    currentReg = await Registration.findOne({ user: req.user.id });
    // Update currentReg
    const {
        isOnStartingList,
        birthDate,
        phone,
        aeroclub,
        region,
        glider,
        competitionClass,
        logger,
        accomodation,
        meals,
        note
    } = req.body;
    currentReg.isOnStartingList = isOnStartingList;
    currentReg.birthDate = birthDate;
    currentReg.phone = phone;
    currentReg.aeroclub = aeroclub;
    currentReg.region = region;
    currentReg.glider = glider;
    currentReg.competitionClass = competitionClass;
    currentReg.logger = logger;
    currentReg.accomodation = accomodation;
    currentReg.meals = meals;
    currentReg.note = note;

    currentReg.save();
    return res.status(201).json(await getUserById(req.user.id));
});

export default router;
