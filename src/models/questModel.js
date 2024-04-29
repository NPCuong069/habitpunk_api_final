const db = require('../config/database');

const getAllQuests = async () => {
  return await db.select('*').from('quest');
};
const getQuestById = async (questId) => {
    return await db('quest').where({ id: questId }).first();
};
module.exports = {
  getAllQuests,
  getQuestById
};
