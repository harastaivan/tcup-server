import { connect, createOrUpdateGliderType, disconnect } from './database';
import { readGliderTypes, writeDebug } from './sheet';

const DEBUG = false;

const importGliders = async (): Promise<void> => {
    try {
        await connect();

        const gliderTypes = await readGliderTypes();

        if (DEBUG) {
            writeDebug(gliderTypes);
        }

        console.log('🎉 Importing gliders...');
        for (const gliderType of gliderTypes) {
            await createOrUpdateGliderType(gliderType);
        }

        console.log('✨ Done.');
    } catch (err) {
        console.error(err);
    } finally {
        await disconnect();
    }
};

importGliders();
