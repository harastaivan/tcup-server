import fetch from 'node-fetch';

export const tryGetIgcId = async (user) => {
    try {
        const response = await fetch(
            `https://igcrankings.fai.org/rest/api/rlpilot?partialFullname=${user.name} ${user.surname}&limit=10`
        );
        const { data } = await response.json();

        if (data.length === 1) {
            return data[0].pilotid;
        }
        return null;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return null;
    }
};
