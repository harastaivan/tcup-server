import dotenv from 'dotenv';
import { bigIntLiteral } from '@babel/types';

dotenv.config();

const mongoUri = () => {
    switch (process.env.NODE_ENV) {
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
    JWT_SECRET: process.env.JWT_SECRET
};
