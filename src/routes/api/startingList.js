import express from 'express';
import { parse } from 'json2csv';

import Registration from '../../models/Registration';
import CompetitionClass from '../../models/CompetitionClass';
import admin from '../../middleware/admin';

const router = express.Router();

const formatDate = (date = new Date()) => {
    return date.toISOString().slice(0, 10);
};

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

// @route   GET api/starting-list/export
// @desc    Get csv export file of all registered pilots
// @access  Admin
router.get('/export', admin, async (req, res) => {
    try {
        const registrations = await Registration.find({})
            .populate('user', '-password')
            .populate(['glider.gliderType', 'region', 'competitionClass', 'accomodation.accomodationType']);

        const docs = registrations.map((registration) => {
            return {
                name: registration.user.name,
                surname: registration.user.surname,
                birthDate: registration.birthDate,
                phone: registration.phone,
                email: registration.user.email,
                aeroclub: registration.aeroclub,
                region: registration.region.name,
                gliderType: registration.glider.gliderType.name,
                gliderIndex: registration.glider.gliderType.index,
                registrationNumber: registration.glider.registrationNumber,
                startNumber: registration.glider.startNumber,
                competitionClass: registration.competitionClass.name,
                accomodationType: registration.accomodation.accomodationType.name,
                accomodationQuantity: registration.accomodation.quantity,
                meals: registration.meals,
                note: registration.note,
                paid: registration.paid ? 'zaplaceno' : 'nezaplaceno'
            };
        });

        const fields = [
            'name',
            'surname',
            'birthDate',
            'phone',
            'email',
            'aeroclub',
            'region',
            'gliderType',
            'gliderIndex',
            'registrationNumber',
            'startNumber',
            'competitionClass',
            'accomodationType',
            'accomodationQuantity',
            'meals',
            'note',
            'paid'
        ];

        const opts = { fields };
        const csv = parse(docs, opts);

        res.attachment(`export-${formatDate()}.csv`);
        res.status(200).send(csv);
    } catch (e) {
        res.status(500).json(e);
    }
});

export default router;
