/* eslint-disable no-console */
import axios from 'axios';
import { getContest } from './contest';
import headers from './headers';
import catchError from './utils/catchError';
import write from './utils/write';

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
