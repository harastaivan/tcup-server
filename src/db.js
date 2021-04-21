/* eslint-disable no-console */
import mongoose from 'mongoose';

export const connect = (db) => {
    mongoose.connection.on('connecting', () => {
        console.log('MongoDB connecting');
    });

    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected');
    });

    mongoose.connection.on('open', () => {
        console.log('MongoDB connection is open');
    });

    mongoose.connection.on('disconnecting', () => {
        console.error('MongoDB disconnecting');
    });

    mongoose.connection.on('disconnected', () => {
        console.error('MongoDB disconnected');
    });

    mongoose.connection.on('close', () => {
        console.error('MongoDB connection closed');
    });

    mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB error', err);
    });

    mongoose.connection.on('fullsetup', () => {
        console.log('MongoDB fullsetup');
    });

    return mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000
    });
};

export const disconnect = () => {
    return mongoose.disconnect();
};
