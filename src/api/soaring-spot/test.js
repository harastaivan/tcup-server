/* eslint-disable no-console */
import axios from 'axios';
import headers from './headers';
import catchError from './utils/catchError';
import write from './utils/write';

const apiEntryPoint = async () => {
    const config = {
        headers
    };

    try {
        const res = await axios.get('https://api.soaringspot.com/v1', config);

        const contest = res.data['_embedded']['http://api.soaringspot.com/rel/contests'][0];

        write('contest.json', contest);

        return {
            contestId: ['id'],
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

const classes = async () => {
    const contest = await apiEntryPoint();
    const config = {
        headers
    };

    return await Promise.all(
        contest.classes.map(async (c) => {
            const res = await axios.get(`https://api.soaringspot.com/v1/classes/${c.id}`, config);
            const _class = res.data;
            console.log(`Class ${_class.name} with ${_class.id} id.`);
            write(`classes/${_class.name.toLowerCase()}.json`, contest);
            return _class;
        })
    );
};

const contestants = async () => {
    try {
        const contest = await apiEntryPoint();
        const config = {
            headers
        };

        contest.classes.forEach(async ({ id }) => {
            try {
                const res = await axios.get(`https://api.soaringspot.com/v1/classes/${id}/contestants`, config);
                const contestant = res.data;
                write(`contestants/${id}.json`, contestant);
                return contestant;
            } catch (err) {
                // catchError(err);
                console.log(err.response.data.message);
            }
        });
    } catch (err) {
        catchError(err);
    }
};

const results = async () => {
    try {
        const contest = await apiEntryPoint();
        const config = {
            headers
        };

        contest.classes.forEach(async ({ id }) => {
            try {
                const res = await axios.get(`https://api.soaringspot.com/v1/classes/${id}/results`, config);
                const results = res.data;
                write(`results/${id}.json`, results);
                return results;
            } catch (err) {
                // catchError(err);
                console.log(err.response.data.message);
            }
        });
    } catch (err) {
        catchError(err);
    }
};

const tasks = async () => {
    try {
        const contest = await apiEntryPoint();
        const config = {
            headers
        };

        contest.classes.forEach(async ({ id }) => {
            try {
                const res = await axios.get(`https://api.soaringspot.com/v1/classes/${id}/tasks`, config);
                return res;
            } catch (err) {
                // catchError(err);
                console.log(err.response.data.message);
            }
        });
    } catch (err) {
        catchError(err);
    }
};

classes();
contestants();
results();
tasks();
