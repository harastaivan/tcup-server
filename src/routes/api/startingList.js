import express from 'express';
import { parse } from 'json2csv';
import encoding from 'encoding';

import Registration from '../../models/Registration';
import CompetitionClass from '../../models/CompetitionClass';
import admin from '../../middleware/admin';

const router = express.Router();

const formatDate = (date = new Date()) => {
    return date.toISOString().slice(0, 10);
};

const getNationalityByRegion = (region) => {
    switch (region) {
        case 'Rakousko':
            return 'AT';
        case 'Německo':
            return 'DE';
        default:
            return 'CZ';
    }
};

const getStartingList = async (registrations) => {
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
            accepted: registration.accepted,
            registrationCompleted: registration.registrationCompleted,
            isReserve: registration.isReserve,
            competitionClass: registration.competitionClass
        };
    });

    const classes = await CompetitionClass.find({}).sort('name');

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

    return startingList;
};

// @route   GET api/starting-list
// @desc    Get starting list of registered (accepted) pilots
// @access  Public
router.get('/', async (req, res) => {
    const registrations = await Registration.find({ accepted: true })
        .populate('user', '-password')
        .populate(['glider.gliderType']);

    const startingList = await getStartingList(registrations);

    res.json(startingList);
});

// @route   GET api/starting-list/all
// @desc    Get starting list of registered (all) pilots
// @access  Public
router.get('/all', admin, async (req, res) => {
    const registrations = await Registration.find()
        .populate('user', '-password')
        .populate(['glider.gliderType']);

    const startingList = await getStartingList(registrations);

    res.json(startingList);
});

// @route   GET api/starting-list/export
// @desc    Get csv export file of all registered pilots
// @access  Admin
router.get('/export', admin, async (req, res) => {
    try {
        const registrations = await Registration.find({ accepted: true })
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

// @route   GET api/starting-list/export/seeyou/:compClass
// @desc    Get csv export file of all registered pilots
// @access  Admin
router.get('/export/seeyou/:compClass', admin, async (req, res) => {
    try {
        const { compClass } = req.params;

        const competitionClass = await CompetitionClass.findById(compClass);

        if (!competitionClass) {
            return res.status(400).json({ msg: 'Invalid competition class' });
        }

        const registrations = await Registration.find({ competitionClass, accepted: true })
            .populate('user', '-password')
            .populate(['glider.gliderType', 'region', 'competitionClass', 'accomodation.accomodationType']);

        const docs = registrations.map((registration) => {
            return {
                first_name: registration.user.name,
                last_name: registration.user.surname,
                birth_date: registration.birthDate,
                nationality: getNationalityByRegion(registration.region.name),
                civl_id: 0,
                igc_id: String(registration.igcId),
                email: registration.user.email,
                phone: registration.phone,
                club: registration.aeroclub,
                team: '',
                sponsors: '',
                aircraft_model: registration.glider.gliderType.name,
                contestant_number: registration.glider.startNumber,
                aircraft_registration: registration.glider.registrationNumber,
                handicap: registration.glider.gliderType.handicap,
                pure_glider: registration.glider.hasEngine ? 'False' : 'True',
                flight_recorders: registration.logger,
                tag: '',
                not_competing: 'False',
                status: '',
                live_track_id: '',
                id_contestant: -1
            };
        });

        const fields = [
            'first_name',
            'last_name',
            'birth_date',
            'nationality',
            'civl_id',
            'igc_id',
            'email',
            'phone',
            'club',
            'team',
            'sponsors',
            'aircraft_model',
            'contestant_number',
            'aircraft_registration',
            'handicap',
            'pure_glider',
            'flight_recorders',
            'tag',
            'not_competing',
            'status',
            'live_track_id',
            'id_contestant'
        ];

        const opts = { fields };
        const csv = encoding.convert(parse(docs, opts), 'windows-1250', 'utf-8');

        res.attachment(`export-${competitionClass.name}-${formatDate()}.csv`);
        res.status(200).send(csv);
    } catch (e) {
        res.status(500).json(e);
    }
});

export default router;
