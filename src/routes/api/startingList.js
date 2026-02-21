import express from 'express';
import { parse } from 'json2csv';

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

const getRegistration = (registration) => {
    return {
        _id: registration._id,
        fullName: `${registration.user.name} ${registration.user.surname}`,
        birthDate: registration.birthDate,
        aeroclub: registration.aeroclub,
        startNumber: registration.glider.startNumber,
        gliderType: `${registration.glider.gliderType.name} (${registration.glider.gliderType.handicap})`,
        registrationNumber: registration.glider.registrationNumber,
        paid: registration.paid,
        registrationCompleted: registration.registrationCompleted,
        competitionClass: registration.competitionClass,
        isWildcard: registration.isWildcard,
        rankingPosition: registration.rankingPosition,
        igcId: registration.igcId
    };
};

const getStartingList = async (registrations, notAcceptedRegistrations) => {
    const classes = await CompetitionClass.find({}).sort('name');

    const startingList = classes.map((one) => {
        return {
            _id: one._id,
            name: one.name,
            // https://stackoverflow.com/questions/11637353/comparing-mongoose-id-and-strings
            registrations: registrations
                .map(getRegistration)
                .filter((registration) => registration.competitionClass._id.equals(one._id))
        };
    });

    startingList.push({
        _id: 'not-accepted',
        name: 'not-accepted',
        registrations: notAcceptedRegistrations.map(getRegistration)
    });

    return startingList;
};

export const getRankedStartingList = async ({ populate = ['glider.gliderType'], isFinal = false }) => {
    const RANKED_POSITIONS = 35;
    let allRankedRegistrations = await Registration.find({ isWildcard: false })
        .populate('user', '-password')
        .populate(populate);

    allRankedRegistrations.sort((a, b) => (a.rankingPosition || 1000) - (b.rankingPosition || 1000));

    let wildcardRegistrations = await Registration.find({ isWildcard: true })
        .populate('user', '-password')
        .populate(populate);

    wildcardRegistrations.sort((a, b) => (a.rankingPosition || 1000) - (b.rankingPosition || 1000));

    let notPaidRegistrations = [];
    if (isFinal) {
        const paidRankedRegistrations = allRankedRegistrations.filter((registration) => registration.paid);
        const notPaidRankedRegistrations = allRankedRegistrations.filter((registration) => !registration.paid);
        const paidWildcardRegistrations = wildcardRegistrations.filter((registration) => registration.paid);
        const notPaidWildcardRegistrations = wildcardRegistrations.filter((registration) => !registration.paid);

        notPaidRegistrations = [...notPaidRankedRegistrations, ...notPaidWildcardRegistrations];
        allRankedRegistrations = paidRankedRegistrations;
        wildcardRegistrations = paidWildcardRegistrations;
    }

    const acceptedRegistrations = [...allRankedRegistrations.slice(0, RANKED_POSITIONS), ...wildcardRegistrations];
    const notAcceptedRegistrations = [...allRankedRegistrations.slice(RANKED_POSITIONS), ...notPaidRegistrations];

    return {
        acceptedRegistrations,
        notAcceptedRegistrations,
        startingList: await getStartingList(acceptedRegistrations, notAcceptedRegistrations)
    };
};

// @route   GET api/starting-list
// @desc    Get starting list of registered pilots based on ranking position and wildcard status
// @access  Public
router.get('/', async (req, res) => {
    const isFinal = req.query.isFinal === 'true';
    const { startingList } = await getRankedStartingList({ isFinal });

    res.json(startingList);
});

// @route   GET api/starting-list/export
// @desc    Get csv export file of all registered pilots
// @access  Admin
router.get('/export', admin, async (req, res) => {
    try {
        const isFinal = req.query.isFinal === 'true';
        const { acceptedRegistrations, notAcceptedRegistrations } = await getRankedStartingList({
            isFinal,
            populate: ['glider.gliderType', 'region', 'competitionClass', 'accomodation.accomodationType']
        });

        const docs = [
            ...acceptedRegistrations.map((registration) => {
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
                    paid: registration.paid ? 'ano' : 'ne',
                    isWildcard: registration.isWildcard ? 'ano' : 'ne',
                    rankingPosition: registration.rankingPosition,
                    igcId: registration.igcId,
                    isReserve: ''
                };
            }),
            ...notAcceptedRegistrations.map((registration) => {
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
                    paid: registration.paid ? 'ano' : 'ne',
                    isWildcard: registration.isWildcard ? 'ano' : 'ne',
                    rankingPosition: registration.rankingPosition,
                    igcId: registration.igcId,
                    isReserve: 'náhradník'
                };
            })
        ];

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
            'paid',
            'isWildcard',
            'rankingPosition',
            'igcId',
            'isReserve'
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

        const { acceptedRegistrations } = await getRankedStartingList({
            isFinal: true,
            populate: ['glider.gliderType', 'region', 'competitionClass', 'accomodation.accomodationType']
        });
        const registrations = acceptedRegistrations.filter((registration) =>
            registration.competitionClass._id.equals(competitionClass._id)
        );

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
        const csv = parse(docs, opts);

        res.attachment(`export-${competitionClass.name}-${formatDate()}.csv`);
        res.status(200).send(csv);
    } catch (e) {
        res.status(500).json(e);
    }
});

export default router;
