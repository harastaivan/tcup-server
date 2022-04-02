import mongoose from 'mongoose';
import { DEBUG, MONGO_URI } from '../constants';

export const connect = async () => {
    if (!MONGO_URI) {
        throw new Error('🚨 No MONGO_URI variable provided');
    }
    DEBUG && console.log(`Connecting to ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    DEBUG && console.log(`Connected`);
};

export const disconnect = () => {
    return mongoose.disconnect();
};

export * from './controller';
