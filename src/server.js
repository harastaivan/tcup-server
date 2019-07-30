#!/usr/bin/env node
import express from 'express';
import mongoose from 'mongoose';
// import morgan from 'morgan'; temporary fix https://github.com/expressjs/morgan/issues/190
const morgan = require('morgan');

import config from '../config';
import users from './routes/api/users';
import auth from './routes/api/auth';
import news from './routes/api/news';
import registration from './routes/api/registration';
import region from './routes/api/region';
import competitionClass from './routes/api/competitionClass';
import gliderType from './routes/api/gliderType';

const app = express();

app.use(morgan('combined'));
app.use(express.json());

const db = config.MONGO_URI;

mongoose
	.connect(db, { useNewUrlParser: true, useCreateIndex: true })
	.then((m) => console.log(`MongoDB connected to ${m.connections[0].db.s.databaseName}`))
	.catch((err) => console.log(err));

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/news', news);
app.use('/api/registration', registration);
app.use('/api/region', region);
app.use('/api/classes', competitionClass);
app.use('/api/glidertypes', gliderType);

const port = config.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
