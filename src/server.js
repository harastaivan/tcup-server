#!/usr/bin/env node
/* eslint no-console: 0 */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
// import morgan from 'morgan'; temporary fix https://github.com/expressjs/morgan/issues/190
const morgan = require('morgan');

import config from '../config';
import version from './routes/api/version';
import users from './routes/api/users';
import auth from './routes/api/auth';
import news from './routes/api/news';
import registration from './routes/api/registration';
import region from './routes/api/region';
import competitionClass from './routes/api/competitionClass';
import gliderType from './routes/api/gliderType';
import accomodationType from './routes/api/accomodationType';
import document from './routes/api/document';
import startingList from './routes/api/startingList';
import error from './middleware/error';

const app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

const db = config.MONGO_URI;

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
});

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

app.use('/', version);

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/news', news);
app.use('/api/registration', registration);
app.use('/api/regions', region);
app.use('/api/classes', competitionClass);
app.use('/api/glidertypes', gliderType);
app.use('/api/accomodationtypes', accomodationType);
app.use('/api/documents', document);
app.use('/api/starting-list', startingList);

app.use(error);

const port = config.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

export default app;
