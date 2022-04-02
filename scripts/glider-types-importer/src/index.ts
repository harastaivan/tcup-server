import { connect, createOrUpdateGliderType, disconnect } from './database';
import { readGliderTypes } from './sheet';

const importGliders = async (): Promise<void> => {
    try {
        await connect();

        const gliderTypes = await readGliderTypes();

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
