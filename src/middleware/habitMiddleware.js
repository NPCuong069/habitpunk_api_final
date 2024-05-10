const { createHabit, getAllHabitsByUser, update, getHabitById, updateHabit, deleteHabit } = require('../models/habitModel');
const { getTodaysCoins, logCoinChange } = require('../models/userCoinsLogModel');
const { updateExperience, updateUserHealthMana, updateCoins } = require('../models/userModel');

exports.createHabit = async (req, res) => {
  const { title, note, difficulty } = req.body;
  const userId = req.user.uid;  // Assuming you're extracting the user ID from authenticated user data
  try {
    const habit = await createHabit(title, note, difficulty, userId);
    res.status(201).json(habit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).send({ message: "Failed to create habit", error: error.message });
  }
};
exports.deleteHabit = async (req, res) => {
  const { habitId } = req.params;

  try {
    const habit = await getHabitById(habitId);
    if (!habit) {
      return res.status(404).send({ message: "Habit not found" });
    }

    await deleteHabit(habitId);

    res.status(200).send({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).send({ message: "Failed to delete habit", error: error.message });
  }
};
exports.getAllHabits = async (req, res) => {
  const userId = req.user.uid; // Assuming 'uid' is stored in req.user when authenticated
  try {
    const habits = await getAllHabitsByUser(userId);
    res.json(habits);
  } catch (error) {
    console.error('Error retrieving habits:', error);
    res.status(500).send({ message: "Failed to retrieve habits", error: error.message });
  }
};
exports.updateHabitDescription = async (req, res) => {
  const { habitId } = req.params;
  const { description } = req.body;

  try {
    // First, check if the daily exists
    const habit = await getHabitById(habitId);
    if (!habit) {
      return res.status(404).send({ message: "Habit not found" });
    }

    // Update the daily's description
    const updateHabit = await updateHabit(habitId, { note: description });

    res.status(200).json(updateHabit);
  } catch (error) {
    console.error('Error updating habit description:', error);
    res.status(500).send({ message: "Failed to update habit description", error: error.message });
  }
};
async function getHabitDifficulty(habitId) {
  try {
      const habit = await getHabitById(habitId);
      if (!habit) {
          console.log("Habit not found");
          return null;  // Return null if the habit does not exist
      }
      return habit.difficulty;  // Return the difficulty if the habit is found
  } catch (error) {
      console.error('Error getting habit difficulty:', error);
      throw error;  // Re-throw the error to handle it further up the call stack
  }
}
exports.performHabitAction = async (req, res) => {
  const { habitId } = req.params;
  const { action } = req.body; // Action can be 'positive' or 'negative'
  const userId = req.user.uid;

  try {
    const habit = await getHabitById(habitId);
    if (!habit) {
      return res.status(404).send({ message: "Habit not found" });
    }

    let updates = {};
    let coinGain = 0;
    if (action === 'positive') {
      updates = { pos_clicks: habit.pos_clicks + 1 };
      coinGain = habit.difficulty + 1; // Assuming coin gain is related to difficulty
    } else if (action === 'negative') {
      updates = { neg_clicks: habit.neg_clicks + 1 };
      // No coin change for negative actions
    } else {
      return res.status(400).send({ message: "Invalid action" });
    }

    // Check and enforce the daily coin limit
    const todaysCoins = await getTodaysCoins(userId);
    if (Number(todaysCoins) + coinGain > 50) {
      console.log(todaysCoins);
      console.log(coinGain);
      console.log(todaysCoins+coinGain);
      coinGain = 0; 
      return res.status(429).send({ message: "Daily coin limit reached for today" });
    }

    // Update the habit
    const updatedHabit = await updateHabit(habitId, updates);

    // Update coins if applicable
    if (coinGain > 0) {
      await updateCoins(userId, coinGain);
      await logCoinChange(userId, coinGain);
      console.log(`Coins logged for User ID ${userId}: ${coinGain}`);
    }
    else {
      console.log('no coin added');
    }
    res.status(200).json(updatedHabit);
  } catch (error) {
    console.error('Error performing habit action:', error);
    res.status(500).send({ message: "Failed to perform habit action", error: error.message });
  }
};