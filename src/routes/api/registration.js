import express from 'express';

import Registration from '../../models/Registration';
import User from '../../models/User';
import auth from '../../middleware/auth';
import admin from '../../middleware/admin';
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

const getRegistrationById = async (id) => {
    return await Registration.findById(id)
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
// @desc    Update registration of current user
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
        oldRegistration.glider.hasEngine = glider.hasEngine;
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

// @route   GET api/registration/:id
// @desc    Get registration data of registration with id in query
// @access  Admin
router.get('/:id', admin, async (req, res) => {
    try {
        const reg = await getRegistrationById(req.params.id);
        if (!reg) {
            return res.status(404).json({ msg: 'Registration with this id does not exist' });
        }
        return res.json(reg);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// @route   PUT api/registration/:id
// @desc    Update registration with id in query
// @access  Admin
router.put('/:id', admin, async (req, res) => {
    try {
        const registration = await getRegistrationById(req.params.id);
        if (!registration) {
            return res.status(404).json({ msg: 'Registration with this id does not exist' });
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
            note,
            igcId,
            registrationCompleted
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

        registration.birthDate = birthDate;
        registration.phone = phone;
        registration.aeroclub = aeroclub;
        registration.region = region;
        registration.glider.gliderType = glider.gliderType;
        registration.glider.registrationNumber = glider.registrationNumber;
        registration.glider.startNumber = glider.startNumber;
        registration.glider.hasEngine = glider.hasEngine;
        registration.competitionClass = competitionClass;
        registration.logger = logger;
        registration.accomodation.accomodationType = accomodation.accomodationType;
        registration.accomodation.quantity = accomodation.quantity;
        registration.meals = meals;
        registration.note = note;
        registration.igcId = igcId;
        registration.registrationCompleted = registrationCompleted;

        await registration.save();

        return res.status(200).json(await getRegistrationById(req.params.id));
    } catch (e) {
        return res.status(400).json({ error: e });
    }
});

// @route   PUT api/registration/:registrationId/quick-actions
// @desc    Update registration quick actions
// @access  Admin
router.put('/:id/quick-actions', admin, async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);
        if (!registration) {
            return res.status(404).json({ msg: 'Registration does not exist for this user' });
        }

        const { paid, accepted } = req.body;

        if (paid !== undefined) {
            registration.paid = paid;
            registration.save();
        }

        if (accepted !== undefined) {
            registration.accepted = accepted;
            registration.save();
        }

        return res.status(200).json(registration);
    } catch (e) {
        return res.status(400).json({ error: e });
    }
});

export default router;
