const { createParty, getPartyById, getPartyByUserId, getPartyDetailsWithQuestsByPartyId } = require('../models/partyModel');
const { leaveParty, getUserPartyIdByFirebaseUid } = require('../models/userModel');

exports.createParty = async (req, res) => {
  const { name } = req.body;
  const leaderId = req.user.uid;  // Assuming this is set from the authenticated user

  try {
    const newParty = await createParty(name, leaderId);
    res.status(201).json(newParty);
  } catch (error) {
    console.error('Error creating party:', error);
    res.status(500).send({ message: "Failed to create party", error: error.message });
  }
};

exports.getPartyMembers = async (req, res) => {
  const { partyId } = req.params;  // Assumes partyId is passed as a URL parameter

  try {
    const members = await getPartyMembers(partyId);
    if (members.length === 0) {
      return res.status(404).send({ message: "No members found for this party" });
    }
    res.json(members);
  } catch (error) {
    console.error('Error getting party members:', error);
    res.status(500).send({ message: "Failed to get party members", error: error.message });
  }
};
exports.getPartyDetails = async (req, res) => {
  const firebaseUid  = req.user.uid;

  try {
      const partyId = await getUserPartyIdByFirebaseUid(firebaseUid);
      if (!partyId) {
          return res.status(404).json({ message: 'User does not belong to any party.' });
      }

      const partyDetails = await getPartyDetailsWithQuestsByPartyId(partyId);
      if (partyDetails.length === 0) {
          return res.status(404).json({ message: 'Party details not found.' });
      }

      res.status(200).json(partyDetails);
  } catch (error) {
      console.error('Failed to retrieve party details:', error);
      res.status(500).json({ message: 'Failed to retrieve party details', error: error.message });
  }
};
exports.getPartyByUser = async (req, res) => {
  try {
    const userId = req.user.uid; // Assuming this is set from the authenticated user
    const party = await getPartyByUserId(userId);
    if (!party) {
      return res.status(404).send({ message: "No party found for this user" });
    }
    res.json(party);
  } catch (error) {
    console.error('Error getting party by user:', error);
    res.status(500).send({ message: "Failed to get party", error: error.message });
  }
};