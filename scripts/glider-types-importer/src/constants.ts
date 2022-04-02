import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI || '';
export const FILENAME = process.env.FILENAME || '';
export const DEBUG = Boolean(process.env.DEBUG) || false;
