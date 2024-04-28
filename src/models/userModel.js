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
const updateUserHealthMana = async (userId, hpChange, enChange) => {
    return db('users')
      .where({ firebase_uid: userId })
      .increment('hp', hpChange)
      .increment('en', enChange);
};
const checkUsernameExists = async (username) => {
    const result = await db('users').where({ username }).first();
    return !!result; // Return true if the user exists, otherwise false
};
const getUserById = (userId) => {
    return db('users').where({ firebase_uid: userId }).first();
};
const equipItem = async (userId, itemId, itemType) => {
    const columnToUpdate = `${itemType}_id`; // For example: 'hat_id'
    const updateObject = {};
    updateObject[columnToUpdate] = itemId;

    await db('users').where({ id: userId }).update(updateObject);
    return getUserById(userId); // Assuming you have a function to fetch user by ID
};
const updateCoins = async (userId, coinsToAdd) => {
    const user = await db('users').where({ firebase_uid: userId }).first();
    const newCoinBalance = user.coin + coinsToAdd;
    await db('users').where({ firebase_uid: userId }).update({ coin: newCoinBalance });
};
const updateUserField = async (firebase_uid, fieldName, fieldValue) => {
    const result = await db('users')
      .where({ firebase_uid })
      .update({ [fieldName]: fieldValue })
      .returning('*'); // Return all fields of the updated user
  
    return result[0]; // Return the updated user object
  };
const updateUser = (userId, updates) => {
    return db('users').where({ firebase_uid: userId }).update(updates).returning('*');
};
const updateExperience = async (userId, expToAdd) => {
    const user = await getUserById(userId);
    if (!user) throw new Error('User not found');

    let newExp = user.xp + expToAdd;
    let newLevel = user.lvl;
    const maxExp = user.lvl * 100;
    const maxHp = user.lvl * 50;
    // Check if the new experience reaches or exceeds the level-up threshold
    while (newExp >= maxExp) {
        newExp -= maxExp;  // Reduce current experience by the max threshold
        newLevel++;        // Increment the level
    }

    await updateUser(userId, { xp: newExp, lvl: newLevel, hp: maxHp, en: 100 });
    return { newExp, newLevel };  // Optionally return new values for confirmation/testing
};
module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    addExperience,
    getUserByFirebaseUid,
    createUser,
    checkUsernameExists,
    updateUserHealthMana,
    updateExperience,
    updateUserField,
    equipItem,
    updateCoins
};