const { createDaily, getUncompletedDailiesByUser, getDailyById, updateDaily, completeDaily,  } = require('../models/dailyModel');
const { updateExperience, updateUserHealthMana } = require('../middleware/userMiddleware');

exports.createDaily = async (req, res) => {
  const { title, note, difficulty } = req.body;
  const userId = req.user.uid;  // Assuming you're extracting the user ID from authenticated user data
  try {
    const daily = await createDaily(title, note, difficulty, userId);
    res.status(201).json(daily);
  } catch (error) {
    console.error('Error creating daily:', error);
    res.status(500).send({ message: "Failed to create daily", error: error.message });
  }
};
exports.getUncompletedDailies = async (req, res) => {
  const userId = req.user.uid; // As above
  try {
    const dailies = await getUncompletedDailiesByUser(userId);
    res.json(dailies);
  } catch (error) {
    console.error('Error retrieving dailies:', error);
    res.status(500).send({ message: "Failed to retrieve dailies", error: error.message });
  }
};
exports.updateDailyNote = async (req, res) => {
  const { dailyId } = req.params;
  const { note } = req.body;
  
  try {
    // First, check if the daily exists
    const daily = await getDailyById(dailyId);
    if (!daily) {
      return res.status(404).send({ message: "Daily not found" });
    }

    const updatedDaily = await updateDaily(dailyId, { note: note });

    res.status(200).json(updatedDaily);
  } catch (error) {
    console.error('Error updating daily note:', error);
    res.status(500).send({ message: "Failed to update daily note", error: error.message });
  }
};
exports.performDailyAction = async (req, res) => {
  const { dailyId } = req.params;
  const userId = req.user.uid;  // Extracted from authenticated user data

  try {
    const daily = await getDailyById(dailyId);
    if (!daily) {
      return res.status(404).send({ message: "Daily not found" });
    }
    if (daily.isCheck) {
      return res.status(400).send({ message: "Daily already completed" });
    }

    // Update the daily as checked
    await completeDaily(dailyId, { ischeck: true });

    // Update user experience
    const expGain = daily.difficulty * 10;
    await updateExperience(userId, expGain);

    res.status(200).send({ message: "Daily completed, experience gained", exp: expGain });
  } catch (error) {
    console.error('Error performing daily action:', error);
    res.status(500).send({ message: "Failed to perform daily action", error: error.message });
  }
};