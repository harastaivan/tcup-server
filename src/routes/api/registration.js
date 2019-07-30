import express from 'express';

import Registration from '../../models/Registration';
import User from '../../models/User';
import auth from '../../middleware/auth';
import AccomodationType from '../../models/AccomodationType';
import Region from '../../models/Region';
import GliderType from '../../models/GliderType';
import CompetitionClass from '../../models/CompetitionClass';

const router = express.Router();

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

	return res.status(201).json(savedReg);
});

// @route   GET api/registration
// @desc    Get registration data of a user
// @access  Private
router.get('/', auth, async (req, res) => {
	const reg = await Registration.findOne({ user: req.user.id })
		.populate('user', '-password')
		.populate([ 'region', 'competitionClass', 'glider.gliderType' ]);
	if (!reg) {
		return res.status(404).json({ msg: 'Registration does not exist for this user' });
	}
	return res.json(reg);
});

export default router;
