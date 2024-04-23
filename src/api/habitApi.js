const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/authMiddleware');
const { createHabit, performHabitAction, getAllHabits } = require('../middleware/habitMiddleware');

// POST endpoint for creating a new habit
router.post('/habits', checkAuth, createHabit);
router.post('/habits/:habitId/perform', checkAuth, performHabitAction);
router.get('/habits', checkAuth, getAllHabits);
module.exports = router;