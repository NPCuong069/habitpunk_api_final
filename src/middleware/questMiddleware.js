const { getAllQuests } = require('../models/questModel');

exports.sendAllQuests = async (req, res) => {
  try {
    const quests = await getAllQuests();
    res.status(200).json(quests);
  } catch (error) {
    console.error('Error retrieving quests:', error);
    res.status(500).json({ message: 'Failed to retrieve quests', error: error.message });
  }
};
