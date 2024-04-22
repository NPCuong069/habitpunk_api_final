const db = require('../config/database'); // Ensure you have a database config file

const getAllUsers = async () => {
    return await db.select('*').from('users');
};
const getUserByFirebaseUid = (firebaseUid) => {
    return db('users').where({ firebase_uid: firebaseUid }).first();
};

const createUser = (userData) => {
    return db('users').insert(userData).returning('*'); // Returning '*' to get the inserted user data
};
const addExperience = async (userId, expToAdd) => {
    const user = await db('users').where({ id: userId }).first();
    const newExp = user.xp + expToAdd;
    await db('users').where({ id: userId }).update({ xp: newExp });
};
const checkUsernameExists = async (username) => {
    const result = await db('users').where({ username }).first();
    return !!result; // Return true if the user exists, otherwise false
};
const getUserById = (userId) => {
    return db('users').where({ id: userId }).first();
};

const updateUser = (userId, updates) => {
    return db('users').where({ id: userId }).update(updates).returning('*');
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    addExperience,
    getUserByFirebaseUid,
    createUser,
    checkUsernameExists
};