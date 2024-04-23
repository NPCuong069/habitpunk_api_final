const { createHabit, getAllHabitsByUser } = require('../models/habitModel');
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
exports.performHabitAction = async (req, res) => {
    const { habitId } = req.params;
    const { action } = req.body; // 'positive' or 'negative'
    const userId = req.user.uid;

    try {
        const habit = await db('habits').where({ id: habitId }).first();
        if (!habit) {
            return res.status(404).send({ message: "Habit not found" });
        }

        if (action === 'positive') {
            const expGain = habit.difficulty * 10;
            await updateExperience(userId, expGain);
            res.status(200).send({ message: "Experience gained", amount: expGain });
        } else if (action === 'negative') {
            const loss = habit.difficulty;
            await updateUserHealthMana(userId, -loss, -loss);
            res.status(200).send({ message: "Health and mana reduced", amount: loss });
        } else {
            res.status(400).send({ message: "Invalid action specified" });
        }
    } catch (error) {
        console.error('Error performing habit action:', error);
        res.status(500).send({ message: "Failed to perform habit action", error: error.message });
    }
};