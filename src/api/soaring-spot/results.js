import axios from 'axios';
import config from '../../../config';
import headers from './headers';
import catchError from './utils/catchError';
import write from './utils/write';

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
        console.log('Fetching results...');
        const id = competitionClass.soaringSpotId;
        const res = await axios.get(`https://api.soaringspot.com/v1/classes/${id}/results`, config);
        const classResults = res.data['_embedded']['http://api.soaringspot.com/rel/class_results'];

        const days = classResults.map(mapDay);

        return { ...competitionClass, days };
    } catch (err) {
        catchError(err);
    }
};

const getSoaringSpotResults = async () => {
    const classes = await CompetitionClass.find({}).lean();

    const results = await Promise.all(classes.map((competitionClass) => getSoaringSpotResult(competitionClass)));

    return results;
};

const getFilteredSoaringSpotResults = async () => {
    const results = await getSoaringSpotResults();

    const filterClases = (classes) => [classes[0]];
    const filterDays = (days) => [days[0], days[1]];
    const filterResults = (results) => [results[0], results[1], results[2], results[3], results[4]];

    const filtered = /* filterClases(results)*/ results.map((competitionClass) => ({
        ...competitionClass,
        days: /* filterDays(competitionClass.days) */ competitionClass.days.map((day) => ({
            ...day,
            results: filterResults(day.results)
        }))
    }));

    write(`results/filtered.json`, filtered);

    return filtered;
};

const syncResults = async () => {
    await connect(db);

    await DailyResult.deleteMany({});

    const results = await getSoaringSpotResults();

    for (const { _id: competitionClassId, days } of results) {
        const competitionClass = await CompetitionClass.findById(competitionClassId);

        for (const { taskDate, taskNumber, results } of days) {
            let competitionDay = await CompetitionDay.findOne({ date: new Date(taskDate) });

            if (!competitionDay) {
                competitionDay = new CompetitionDay({
                    name: `Den ${taskNumber}`,
                    date: taskDate,
                    task: 'TASK'
                });
                await competitionDay.save();
            }

            for (const result of results) {
                // await test(2000);
                console.log({ competitionClassId, taskDate, taskNumber, result });

                const dailyResult = new DailyResult({
                    ...result,
                    competitionClass,
                    day: competitionDay
                });

                await dailyResult.save();
            }
        }
    }

    await disconnect();
};

syncResults();
