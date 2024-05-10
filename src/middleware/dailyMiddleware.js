const { createDaily, getDailyById, updateDaily, completeDaily, countDailiesByUser, deleteDaily, getDailiesByUser } = require('../models/dailyModel');
const { updateExperience } = require('../middleware/userMiddleware');
const { updateCoins } = require('../models/userModel');
const { getTodaysCoins, logCoinChange } = require('../models/userCoinsLogModel');

exports.createDaily = async (req, res) => {
  const { title, note, difficulty } = req.body;
  const userId = req.user.uid; // Assuming you're extracting the user ID from authenticated user data

  try {
    // Check the current count of dailies
    const dailyCount = await countDailiesByUser(userId);
    if (dailyCount >= 4) {
      return res.status(429).send({ message: "Maximum of 4 uncompleted dailies allowed" });
    }

    const daily = await createDaily(title, note, difficulty, userId);
    res.status(201).json(daily);
  } catch (error) {
    console.error('Error creating daily:', error);
    res.status(500).send({ message: "Failed to create daily", error: error.message });
  }
};

exports.getDailiesByUser = async (req, res) => {
  const userId = req.user.uid; // As above
  try {
    const dailies = await getDailiesByUser(userId);
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
exports.deleteDaily = async (req, res) => {
  const { dailyId } = req.params;

  try {
    const daily = await getDailyById(dailyId);
    if (!daily) {
      return res.status(404).send({ message: "Daily not found" });
    }

    await deleteDaily(dailyId);

    res.status(200).send({ message: "Daily deleted successfully" });
  } catch (error) {
    console.error('Error deleting daily:', error);
    res.status(500).send({ message: "Failed to delete daily", error: error.message });
  }
};
exports.performDailyAction = async (req, res) => {
  const { dailyId } = req.params;
  const userId = req.user.uid;

  try {
    const daily = await getDailyById(dailyId);
    if (!daily) {
      return res.status(404).send({ message: "Daily not found" });
    }
    if (daily.isCheck) {
      return res.status(400).send({ message: "Daily already completed" });
    }

    await completeDaily(dailyId, { ischeck: true });

    // Update user experience
    const expGain = (daily.difficulty + 1) * 10;
    await updateExperience(userId, expGain);
    const todaysCoins = await getTodaysCoins(userId);
    const potentialCoins = daily.difficulty + 1;
    if (Number(todaysCoins) + potentialCoins > 50) {
      return res.status(429).send({ message: "Daily coin limit reached for today" });
    }
    await updateCoins(userId, potentialCoins);
    await logCoinChange(userId, potentialCoins, 'earned from daily');

    res.status(200).send({ message: "Daily completed, experience and coins gained", exp: expGain, coins: potentialCoins });
  } catch (error) {
    console.error('Error performing daily action:', error);
    res.status(500).send({ message: "Failed to perform daily action", error: error.message });
  }
};