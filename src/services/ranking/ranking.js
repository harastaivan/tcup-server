import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

const rankingFile = path.join(__dirname, 'ranking_2025.csv');

const getRankingList = () => {
    return new Promise((resolve, reject) => {
        // read csv file from ranking.csv
        const rankingList = [];
        fs.createReadStream(rankingFile, 'utf8')
            .pipe(csvParser({ separator: '\t' }))
            .on('data', (row) => {
                rankingList.push(row);
            })
            .on('end', () => {
                if (rankingList.length === 0) {
                    reject(new Error('Ranking list is empty'));
                }
                resolve(rankingList);
            })
            .on('error', reject);
    });
};

export const getRankingPositionForPilot = async (pilot, birthDate) => {
    try {
        const rankingList = await getRankingList();
        const pilotFullname = getPilotFullname(pilot);

        const results = rankingList
            .filter((row) => row.fullName)
            .filter((row) => row.fullName.toLowerCase().includes(pilotFullname));

        if (results.length === 0) {
            return null;
        }
        if (results.length === 1) {
            return Number(results[0].rank);
        }

        if (!birthDate) return null;
        // More results than 1, filter by birth date
        const resultsByBirthDate = results.filter((row) => row.birthDate == getYearFromDate(birthDate));

        if (resultsByBirthDate.length === 1) {
            return Number(resultsByBirthDate[0].rank);
        }

        return null;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return null;
    }
};

const getPilotFullname = (pilot) => {
    return [pilot.name, pilot.surname]
        .map(normalizedString)
        .join(' ')
        .trim();
};

const normalizedString = (str) =>
    str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

const getYearFromDate = (dateString) => new Date(dateString).getFullYear();
