/* eslint-disable no-console */
import axios from 'axios';
import config from '../../../config';
import headers from './headers';
import catchError from './utils/catchError';

import CompetitionClass from '../../models/CompetitionClass';
import DailyResult from '../../models/DailyResult';
import { connect, disconnect } from '../../db';
import CompetitionDay from '../../models/CompetitionDay';

const db = config.MONGO_URI;

const getFlightId = (result) => {
    const links = result['_links'];
    if (!links) {
        return null;
    }
    const href = links['http://api.soaringspot.com/rel/flight']['href'];
    const parts = href.split('https://api.soaringspot.com/v1/flights/');
    if (parts.length !== 2) {
        return null;
    }
    return Number(parts[1]);
};

const mapResult = (result) => {
    const contestant = result['_embedded']['http://api.soaringspot.com/rel/contestant'];

    return {
        points: result.points,
        points_total: result.points_total,
        position: result.rank,
        position_total: result.rank_total,
        flightId: getFlightId(result),
        name: contestant.name,
        aeroclub: contestant.club,
        glider: contestant.aircraft_model,
        handicap: contestant.handicap
    };
};

const mapDay = (day) => {
    const results = day['_embedded']['http://api.soaringspot.com/rel/results'];

    return {
        taskDate: day.task_date,
        taskNumber: day.task_number,
        results: results.map(mapResult) || []
    };
};

const getSoaringSpotResult = async (competitionClass) => {
    const config = {
        headers
    };

    try {
        console.log(`Fetching results for ${competitionClass.name} class...`);
        const id = competitionClass.soaringSpotId;
        const res = await axios.get(`https://api.soaringspot.com/v1/classes/${id}/results`, config);
        const classResults = res.data['_embedded']['http://api.soaringspot.com/rel/class_results'];

        const days = classResults.map(mapDay);

        return { ...competitionClass, days };
    } catch (err) {
        catchError(err);
        return { ...competitionClass, days: null };
    }
};

const getSoaringSpotResults = async () => {
    const classes = await CompetitionClass.find({}).lean();

    const results = await Promise.all(classes.map((competitionClass) => getSoaringSpotResult(competitionClass)));

    return results;
};

const syncResults = async () => {
    await connect(db);

    console.log('Synchronizing results from SoaringSpot API...');
    console.log('Deleting DailyResults...');

    await DailyResult.deleteMany({});

    const results = await getSoaringSpotResults();

    let newCompetitionDaysCount = 0;
    let existingCompetitionDaysCount = 0;
    let newResultsCount = 0;

    for (const { _id: competitionClassId, days } of results) {
        const competitionClass = await CompetitionClass.findById(competitionClassId);

        // Check if days is null (there was an error fetching results for the class)
        if (days === null) {
            console.log(`Skipping results for class ${competitionClassId}...`);
            continue;
        }

        for (const { taskDate, taskNumber, results } of days) {
            let competitionDay = await CompetitionDay.findOne({ date: new Date(taskDate) });

            if (!competitionDay) {
                competitionDay = new CompetitionDay({
                    name: `Den ${taskNumber}`,
                    date: taskDate,
                    task: 'TASK'
                });
                await competitionDay.save();
                newCompetitionDaysCount++;
            } else {
                existingCompetitionDaysCount++;
            }

            for (const result of results) {
                // console.log({ competitionClassId, taskDate, taskNumber, result });

                const dailyResult = new DailyResult({
                    ...result,
                    competitionClass,
                    day: competitionDay
                });

                await dailyResult.save();
                newResultsCount++;
            }
        }
    }

    console.log('Synchronization done.');
    console.log(`New results: ${newResultsCount}`);
    console.log(`Existing competition days: ${existingCompetitionDaysCount}`);
    console.log(`New competition days: ${newCompetitionDaysCount}`);

    await disconnect();
};

syncResults();
