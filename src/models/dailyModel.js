const db = require('../config/database');


const getDailyById = (dailyId) => {
  return db('dailies').where({ id: dailyId }).first();
};
const getDailiesByUser = (userId) => {
  return db('dailies')
    .where({
      user_id: userId,
      is_deleted: false  // Ensure only non-deleted dailies are returned
    })
    .select('*');
};
const resetDailyChecks = async () => {
  try {
    const result = await db('dailies')
      .where({ is_deleted: false })
      .update({ ischeck: false });
    console.log(`Reset ${result} dailies to unchecked`);
  } catch (error) {
    console.error('Error resetting daily checks:', error);
  }
}
const updateDaily = (dailyId, updates) => {
  return db('dailies').where({ id: dailyId }).update(updates).returning('*');
};
const completeDaily = (dailyId, updates) => {
  return db('dailies').where({ id: dailyId }).update(updates).increment('clicks', 1).returning('*');
};
const deleteDaily = (dailyId) => {
  return db('dailies').where({ id: dailyId }).update({ is_deleted: true });
};
const countDailiesByUser = async (userId) => {
  return db('dailies')
    .where({
      user_id: userId,
      is_deleted: false
    })
    .count({ count: 'id' })
    .then(results => results[0].count);
};
const createDaily = async (title, note, difficulty, userId) => {
  try {
    const [daily] = await db('dailies').insert({
      title: title,
      note: note,
      difficulty: difficulty,
      created_at: new Date(),
      clicks: 0,
      user_id: userId,
      ischeck: false
    }, ['*']);

    return daily;
  } catch (error) {
    console.error('Error creating daily:', error);
    throw new Error(`Failed to create daily: ${error.message}`);
  }
};
module.exports = {
  getDailyById,
  updateDaily,
  createDaily,
  getDailiesByUser,
  completeDaily,
  deleteDaily,
  countDailiesByUser,
  resetDailyChecks
};
