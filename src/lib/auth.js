import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidV4 } from 'uuid';

import { JWT_SECRET } from '../../config';

export const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        // Create salt & hash
        bcrypt.genSalt(10, (err, salt) => {
            if (err) reject(err);
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) reject(err);
                resolve(hash);
            });
        });
    });
};

export const checkPassword = (password, hash) => {
    return bcrypt.compare(password, hash);
};

export const getToken = (id) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ id }, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
};

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

export const generateToken = () => {
    return new Promise((resolve, reject) => {
        jwt.sign({ token: uuidV4() }, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
};
