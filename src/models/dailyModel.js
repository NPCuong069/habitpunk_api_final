const db = require('../config/database');

const getDailyById = (dailyId) => {
  return db('dailies').where({ id: dailyId }).first();
};
const getUncompletedDailiesByUser = (userId) => {
  return db('dailies').where({ user_id: userId, ischeck: false }).select('*');
};
const updateDaily = (dailyId, updates) => {
  return db('dailies').where({ id: dailyId }).update(updates).returning('*');
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
  getUncompletedDailiesByUser
};
