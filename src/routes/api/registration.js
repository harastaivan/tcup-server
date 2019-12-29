import express from 'express';

import Registration from '../../models/Registration';
import User from '../../models/User';
import auth from '../../middleware/auth';
import AccomodationType from '../../models/AccomodationType';
import Region from '../../models/Region';
import GliderType from '../../models/GliderType';
import CompetitionClass from '../../models/CompetitionClass';

const router = express.Router();

const getRegistrationByUser = async (id) => {
    return await Registration.findOne({ user: id })
        .populate('user', '-password')
        .populate(['region', 'competitionClass', 'glider.gliderType', 'accomodation.accomodationType']);
};

// @route   POST api/registration
// @desc    Create a registration of a user
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { phone, aeroclub, region, glider, competitionClass, logger, accomodation } = req.body;

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

        await newReg.save();

        return res.status(201).json(await getRegistrationByUser(req.user.id));
    } catch (e) {
        return res.status(400).json({ error: e });
    }
});

// @route   GET api/registration
// @desc    Get registration data of a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const reg = await getRegistrationByUser(req.user.id);
        if (!reg) {
            return res.status(404).json({ msg: 'Registration does not exist for this user' });
        }
        return res.json(reg);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// @route   GET api/registration/form
// @desc    Get data for registration form
// @access  Public
router.get('/form', async (req, res) => {
    try {
        const accomodationTypes = await AccomodationType.find({}).sort('name');
        const competitionClasses = await CompetitionClass.find({}).sort('name');
        const gliderTypes = await GliderType.find({}).sort('name');
        const regions = await Region.find({}).sort('name');

        return res.json({ accomodationTypes, competitionClasses, gliderTypes, regions });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// @route   PUT api/registration
// @desc    Update registration of user
// @access  Private
router.put('/', auth, async (req, res) => {
    try {
        const oldRegistration = await getRegistrationByUser(req.user.id);
        if (!oldRegistration) {
            return res.status(404).json({ msg: 'Registration does not exist for this user' });
        }
        const {
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

        oldRegistration.birthDate = birthDate;
        oldRegistration.phone = phone;
        oldRegistration.aeroclub = aeroclub;
        oldRegistration.region = region;
        oldRegistration.glider.gliderType = glider.gliderType;
        oldRegistration.glider.registrationNumber = glider.registrationNumber;
        oldRegistration.glider.startNumber = glider.startNumber;
        oldRegistration.competitionClass = competitionClass;
        oldRegistration.logger = logger;
        oldRegistration.accomodation.accomodationType = accomodation.accomodationType;
        oldRegistration.accomodation.quantity = accomodation.quantity;
        oldRegistration.meals = meals;
        oldRegistration.note = note;

        await oldRegistration.save();

        return res.status(200).json(await getRegistrationByUser(req.user.id));
    } catch (e) {
        return res.status(400).json({ error: e });
    }
});

export default router;
