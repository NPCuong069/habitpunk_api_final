const { getUserPartyIdByFirebaseUid } = require('../models/userModel');
const { getQuestById } = require('../models/questModel');
const db = require('../config/database');

exports.addPartyQuest = async (req, res) => {
    const {  questId } = req.body;
    const firebaseUid = req.user.uid;
    try {
        // Fetch party_id from user's Firebase UID
        const partyId = await getUserPartyIdByFirebaseUid(firebaseUid);
        if (!partyId) {
            return res.status(404).json({ message: 'User does not belong to any party.' });
        }

        // Fetch quest details
        const quest = await getQuestById(questId);
        if (!quest) {
            return res.status(404).json({ message: 'Quest not found.' });
        }

        // Insert new party quest
        const newPartyQuest = {
            party_id: partyId,
            quest_id: questId,
            hp: quest.hp,
            break: quest.break,
            status: 1, // Setting status to 1 as required
            created_at: new Date() // Set the created_at to the current date
        };
        const insertedPartyQuest = await db('party_quest').insert(newPartyQuest).returning('*');
        
        res.status(201).json({ message: 'Party quest added successfully.', partyQuest: insertedPartyQuest });
    } catch (error) {
        console.error('Failed to add party quest:', error);
        res.status(500).json({ message: 'Failed to add party quest', error: error.message });
    }
};
