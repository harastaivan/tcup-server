import dotenv from 'dotenv';

dotenv.config();

export const ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 5000;
export const URL = process.env.BASE_URL || 'http://localhost:3000';
export const MONGO_URI = ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET = process.env.AWS_SECRET;
export const SEND_EMAILS_TO_ALL = process.env.SEND_EMAILS_TO_ALL === 'true';
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
export const SOARING_SPOT_CLIENT_ID = process.env.SOARING_SPOT_CLIENT_ID;
export const SOARING_SPOT_SECRET = process.env.SOARING_SPOT_SECRET;
