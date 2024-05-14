const db = require('../config/database');

const createParty = async (name, leaderId) => {
  console.log('Name: ' + name + 'leader: ' + leaderId);
  return db.transaction(async trx => {
    const [party] = await trx('party').insert({ name, leader_id: leaderId }).returning('*');
    await trx('users').where({ firebase_uid: leaderId }).update({ party_id: party.id });
    return party;
  });
};
const getPartyDetailsWithQuestsByPartyId = async (partyId) => {
  return db('party')
      .where('party.id', partyId)
      .leftJoin('party_quest', function() {
          this.on('party.id', '=', 'party_quest.party_id')
              .andOn('party_quest.status', '=', 1); // Ensures only active quests are joined
      })
      .leftJoin('quest', 'party_quest.quest_id', 'quest.id') // Additional join with the quest table
      .select(
          'party.id', 
          'party.name as party_name', 
          'party.leader_id',
          'party_quest.quest_id', 
          'party_quest.hp', 
          'party_quest.break',
          'party_quest.created_at', 
          'party_quest.status',
          'quest.name as quest_name', // Fetches the quest name as "quest_name"
          'quest.hp as max_hp', // Fetches the quest hp as "max_hp"
          'quest.break as max_break', 
          'quest.details as quest_details',
          'quest.reward as quest_reward',
          'quest.xp as quest_xp',
      ).first();
};
const getPartyById = async (partyId) => {
  return db('party').where({ id: partyId }).first();
};
const getPartyMembers = async (partyId) => {
  return db('users')
    .select('*')
    .where({ party_id: partyId });
};
const getPartyByUserId = async (userId) => {
  const party = await db('users')
    .join('party', 'users.party_id', '=', 'party.id')
    .select('party.*')
    .where('users.firebase_uid', userId)
    .first();
  return party;
};
const getUserParty = async (userId) => {
  // Fetch the party_id for the user
  const result = await db('users').where({ firebase_uid: userId }).select('party_id').first();
  return result ? result.party_id : null;
};

const getActivePartyQuest = async (partyId) => {
  // Fetch the active quest for the party
  return db('party_quest')
    .where({ party_id: partyId, status: 1 })
    .first();
};

const decrementQuestHp = async (questId, hpDecrement) => {
  // Decrement HP of the quest by the given amount
  return db('party_quest')
    .where({ id: questId })
    .decrement('hp', hpDecrement);
};

module.exports = {
  createParty,
  getPartyById,
  getPartyMembers,
  getPartyByUserId,
  getPartyDetailsWithQuestsByPartyId,
  getUserParty,
  getActivePartyQuest,
  decrementQuestHp
};