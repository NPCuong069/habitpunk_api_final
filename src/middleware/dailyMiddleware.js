const db = require('../models/dailyModel');
const userModel = require('../models/userModel');

const completeDailyTask = async (req, res) => {
  const { dailyId } = req.params;
  try {
    const daily = await db.getDailyById(dailyId);
    if (!daily) {
      return res.status(404).send('Daily task not found');
    }
    if (daily.ischeck) {
      return res.status(400).send('Task already completed');
    }

    const updatedDaily = await db.updateDaily(dailyId, {
      ischeck: true,
      clicks: daily.clicks + 1
    });

    const expToAdd = daily.difficulty * 10;
    await userModel.addExperience(daily.user_id, expToAdd);

    res.status(200).json(updatedDaily);
  } catch (error) {
    console.error('Error completing daily task:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  completeDailyTask
};
