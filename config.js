import dotenv from 'dotenv';

dotenv.config();

const mongoUri = (environment = process.env.NODE_ENV) => {
    switch (environment) {
        case 'production':
            return process.env.MONGO_URI_PROD;
        case 'test':
            return process.env.MONGO_URI_TEST;
        default:
            return process.env.MONGO_URI_DEV;
    }
};

export default {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    URL: process.env.BASE_URL || 'http://localhost:3000',
    MONGO_URI: mongoUri(),
    JWT_SECRET: process.env.JWT_SECRET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET: process.env.AWS_SECRET,
    SEND_EMAILS_TO_ALL: process.env.SEND_EMAILS_TO_ALL === 'true',
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SOARING_SPOT_CLIENT_ID: process.env.SOARING_SPOT_CLIENT_ID,
    SOARING_SPOT_SECRET: process.env.SOARING_SPOT_SECRET
};
