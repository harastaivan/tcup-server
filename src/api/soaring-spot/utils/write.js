/* eslint-disable no-console */
import fs from 'fs';

const writeResponse = (path, data) => {
    path = `src/api/soaring-spot/data/${path}`;
    fs.writeFile(path, JSON.stringify(data), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Written data to ${path}`);
    });
};

export default writeResponse;
