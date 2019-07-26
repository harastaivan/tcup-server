import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './routes/api/users.js';

const app = express();
dotenv.config();

app.use(express.json());

const db = process.env.MONGO_URI;

mongoose
	.connect(db, { useNewUrlParser: true, useCreateIndex: true })
	.then((m) => console.log(`MongoDB connected to ${m.connections[0].db.s.databaseName}`))
	.catch((err) => console.log(err));

app.use('/api/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
