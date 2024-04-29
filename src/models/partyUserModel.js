const db = require('../config/database');

const addMemberToParty = async (partyId, userId) => {
  return db('party_users').insert({
    party_id: partyId,
    user_id: userId
  }).returning('*');
};

const getPartyMembers = async (partyId) => {
  return db('party_users').where({ party_id: partyId });
};

module.exports = {
  addMemberToParty,
  getPartyMembers,
};