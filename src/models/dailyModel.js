const db = require('../config/database');

const getDailyById = (dailyId) => {
  return db('dailies').where({ id: dailyId }).first();
};

const updateDaily = (dailyId, updates) => {
  return db('dailies').where({ id: dailyId }).update(updates).returning('*');
};

module.exports = {
  getDailyById,
  updateDaily
};
