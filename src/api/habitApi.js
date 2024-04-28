const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/authMiddleware');
const { createHabit, performHabitAction, getAllHabits, deleteHabit } = require('../middleware/habitMiddleware');

// POST endpoint for creating a new habit
router.post('/habits', checkAuth, createHabit);
router.post('/habits/:habitId/perform', checkAuth, performHabitAction);
router.get('/habits', checkAuth, getAllHabits);
router.delete('/habits/:habitId', checkAuth, deleteHabit); 
module.exports = router;