const { createHabit, getAllHabitsByUser, update, getHabitById, updateHabit, deleteHabit } = require('../models/habitModel');
const { updateExperience, updateUserHealthMana } = require('../models/userModel');

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

  exports.performHabitAction = async (req, res) => {
    const { habitId } = req.params;
    const { action } = req.body; // Action can be 'positive' or 'negative'

    try {
        // First, check if the habit exists
        const habit = await getHabitById(habitId);
        if (!habit) {
               console.log("fail");
            return res.status(404).send({ message: "Habit not found" });
        }
        let updates = {};
        if (action === 'positive') {
            updates = { pos_clicks: habit.pos_clicks + 1 };
            console.log("success");
        } else if (action === 'negative') {
            updates = { neg_clicks: habit.neg_clicks + 1 };
            console.log("success");
        } else {
            console.log("fail");
            return res.status(400).send({ message: "Invalid action" });
        }
        const updatedHabit = await updateHabit(habitId, updates);

        res.status(200).json(updatedHabit);
    } catch (error) {
        console.error('Error performing habit action:', error);
        res.status(500).send({ message: "Failed to perform habit action", error: error.message });
    }
};