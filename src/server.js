#!/usr/bin/env node
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

const app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

const db = config.MONGO_URI;

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(m => {
        console.log(`MongoDB connected`);
    })
    .catch(err => console.error(err));

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

const port = config.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

export default app;
