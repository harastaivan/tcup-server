/* eslint-disable no-console */
import axios from 'axios';
import config from '../../../config';
import { connect, disconnect } from '../../db';
import CompetitionClass from '../../models/CompetitionClass';
import Contest from '../../models/Contest';
import headers from './headers';
import catchError from './utils/catchError';
import write from './utils/write';

const db = config.MONGO_URI;

const getSoaringSpotContest = async () => {
    const config = {
        headers
    };

    try {
        const res = await axios.get('https://api.soaringspot.com/v1', config);

        const contest = res.data['_embedded']['http://api.soaringspot.com/rel/contests'][0];

        write('contest.json', contest);

        return {
            id: contest['id'],
            name: contest['name'],
            start_date: contest['start_date'],
            end_date: contest['end_date'],
            classes: contest['_embedded']['http://api.soaringspot.com/rel/classes']
            /*links: {
            classes:
                contest['_links']['http://api.soaringspot.com/rel/classes'],
            location:
                contest['_links']['http://api.soaringspot.com/rel/location'],
            winners:
                contest['_links']['http://api.soaringspot.com/rel/winners'],
        },*/
        };
    } catch (err) {
        catchError(err);
    }
};

const syncContest = async () => {
    const contest = await getSoaringSpotContest();

    await connect(db);

    await syncCompetitionClasses(contest.classes);

    const existingContest = await Contest.findOne({ soaringSpotId: contest.id });

    if (existingContest) {
        console.log('Updating contest...');

        existingContest.name = contest.name;
        existingContest.start_date = contest.start_date;
        existingContest.end_date = contest.end_date;

        await existingContest.save();

        await disconnect();
        return console.log('Contest updated.');
    }

    console.log('Creating contest...');

    const newContest = new Contest({
        soaringSpotId: contest.id,
        name: contest.name,
        startDate: contest.start_date,
        endDate: contest.end_date
    });

    await newContest.save();

    await syncCompetitionClasses(contest.classes);

    await disconnect();
    return console.log(`Contest ${newContest.name} created.`);
};

const syncCompetitionClasses = async (classes) => {
    classes.forEach(async (competitionClass) => {
        const existingClass = await CompetitionClass.findOne({ soaringSpotId: competitionClass.id });

        if (existingClass) {
            console.log('Updating class...');

            existingClass.name = competitionClass.name;
            existingClass.type = competitionClass.type;

            await existingClass.save();

            return console.log('Class updated.');
        }

        console.log('Creating class...');

        const newClass = new CompetitionClass({
            soaringSpotId: competitionClass.id,
            name: competitionClass.name,
            type: competitionClass.type
        });

        await newClass.save();
        return console.log(`Class ${newClass.name} created.`);
    });
};

export const getContest = async () => {
    try {
        const contest = await Contest.findOne({});

        return contest;
    } catch (err) {
        console.error('Error getting contest.');
        console.error(err);
    }
};

syncContest();
