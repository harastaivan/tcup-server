import fs from 'fs';
import { getYesNo } from 'cli-interact';

import { connect, disconnect } from '../../src/db';
import User from '../../src/models/User';

console.log('Migrate users');

const COLLECTION_OLD = 'tcup_prod_2020';
const COLLECTION_NEW = 'tcup_prod_2021';
const USER = 'ivan';
const PASSWORD = 'password';
const NEW_USERS_FILE = 'users.json';

const DB_OLD = `mongodb+srv://${USER}:${PASSWORD}@cluster1.isq4l.mongodb.net/${COLLECTION_OLD}?retryWrites=true&w=majority`;
const DB_NEW = `mongodb+srv://${USER}:${PASSWORD}@cluster1.isq4l.mongodb.net/${COLLECTION_NEW}?retryWrites=true&w=majority`;

const mapUser = (user) => ({
    name: user.name,
    surname: user.surname,
    email: user.email,
    password: user.password,
    admin: user.admin
});

const compareUsers = (user1, user2) => {
    return user1.email.toLowerCase() === user2.email.toLowerCase();
};

const readFile = (path) => {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
};

const getOldUsers = async () => {
    await connect(DB_OLD);

    const users = await User.find({}).exec();

    await disconnect();

    return users.map(mapUser);
};

const getExistingUsers = async () => {
    connect(DB_NEW);

    const users = await User.find({})
        .select('-password')
        .exec();

    users.forEach((user) => {
        console.log(user.email);
    });

    return users;
};

const getNewUsers = () => {
    const users = readFile(`${__dirname}/${NEW_USERS_FILE}`);

    return users.map((user) => ({
        name: user.name,
        surname: user.surname,
        email: user.email,
        password: 'invalid_password',
        admin: false
    }));
};

const addUsersInformation = (newUsers, oldUsers) => {
    const addUserInformation = (newUser, oldUsers) => {
        const match = oldUsers.find((oldUser) => compareUsers(oldUser, newUser));
        if (!match) {
            return newUser;
        }
        return {
            name: match.name,
            surname: match.surname,
            email: newUser.email,
            password: match.password,
            admin: match.admin
        };
    };

    return newUsers.map((newUser) => addUserInformation(newUser, oldUsers));
};

const removeExistingUsers = (newUsers, existingUsers) => {
    const doesUserExist = (newUser, existingUsers) => {
        const match = existingUsers.find((oldUser) => compareUsers(oldUser, newUser));
        return !!match;
    };
    return newUsers.filter((newUser) => !doesUserExist(newUser, existingUsers));
};

const insertUsers = async (newUsers) => {
    const users = newUsers.map((newUser) => {
        return new User({
            name: newUser.name,
            surname: newUser.surname,
            email: newUser.email,
            password: newUser.password,
            admin: newUser.admin
        });
    });

    try {
        const result = await User.insertMany(users);
        console.log(`Inserted ${result.length} users.`);
    } catch (err) {
        console.error('There was an error inserting users...');
        console.error(err);
    }
};

const reviewOldUsers = async (oldUsers, usersToIgnore) => {
    const usersToReview = removeExistingUsers(oldUsers, usersToIgnore);
    const usersToInsert = usersToReview.filter((user) =>
        getYesNo(`Insert user ${user.name} ${user.surname} <${user.email}>?`)
    );
    console.log(`${usersToInsert.length} -- Users to insert (reviewed)`);
    console.log(`${JSON.stringify(usersToInsert.map((user) => user.email))} -- These users will be inserted`);

    if (!getYesNo('Do you want to insert the users?')) {
        console.log('Inserting cancelled');
        return;
    }

    console.log('Inserting users...');

    await insertUsers(usersToInsert);
};

const migrateUsers = async () => {
    const oldUsers = await getOldUsers();
    const existingUsers = await getExistingUsers();
    const newUsers = getNewUsers();

    const completeNewUsers = addUsersInformation(newUsers, oldUsers);
    const usersToInsert = removeExistingUsers(completeNewUsers, existingUsers);

    console.log(`${oldUsers.length} -- Old users (${COLLECTION_OLD})`);
    console.log(`${existingUsers.length} -- Existing users (${COLLECTION_NEW})`);
    console.log(`${newUsers.length} -- New users (${NEW_USERS_FILE})`);
    console.log(`${completeNewUsers.length} -- Complete new users (merged new and old)`);
    console.log(`${usersToInsert.length} -- Users to insert (filtered existing)`);
    console.log(`${JSON.stringify(usersToInsert.map((user) => user.email))} -- These users will be inserted`);

    if (getYesNo('Do you want to insert the users?')) {
        console.log('Inserting users...');
        await insertUsers(usersToInsert);
    }

    if (getYesNo('Do you want to review all old users to insert them into database?')) {
        console.log('Reviewing users...');
        await reviewOldUsers(oldUsers, existingUsers);
    }

    await disconnect();
};

migrateUsers();
