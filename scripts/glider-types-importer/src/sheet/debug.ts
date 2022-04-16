import fs from 'fs';
import path from 'path';
import type { GliderType } from '../database/models/types';

export const writeDebug = (gliderTypes: GliderType[]) => {
    const file = path.resolve(__dirname, '..', '..', 'data', 'debug.json');
    fs.writeFileSync(file, JSON.stringify(gliderTypes), {
        encoding: 'utf-8',
        flag: 'a'
    });
    console.log('🐛 Debug file data/debug.json written.');

    for (const gliderType of gliderTypes) {
        if (gliderType.handicap !== undefined && isNaN(gliderType.handicap)) {
            console.log(gliderType)
        }
    }
};
