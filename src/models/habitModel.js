const db = require('../config/database');

const getAllHabitsByUser = (userId) => {
    return db('habits').where({ user_id: userId }).select('*');
};
const getHabitById = (habitId) => {
    return db('habits').where({ id: habitId }).first();
};
const updateHabit = (habitId, updates) => {
    return db('habits').where({ id: habitId }).update(updates).returning('*');
};
const deleteHabit = (habitId) => {
    return db('habits').where({ id: habitId }).update({ is_deleted: true });
};
const createHabit = async (title, note, difficulty, userId) => {
    try {
        // Specify each column explicitly with correct data types
        const [habit] = await db('habits').insert({
            title: title,
            note: note,
            difficulty: difficulty,
            created_at: new Date(),  // Ensure this matches the expected column data type
            pos_clicks: 0,
            neg_clicks: 0,
            user_id: userId
        }, ['*']); // Asking Knex to return all columns of the newly inserted row

        return habit;
    } catch (error) {
        console.error('Error creating habit:', error);
        throw new Error(`Failed to create habit: ${error.message}`);
    }
};
module.exports = {
    createHabit,
    getAllHabitsByUser,
    updateHabit,
    getHabitById,
    deleteHabit
};
