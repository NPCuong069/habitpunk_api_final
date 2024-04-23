const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/authMiddleware');
const { createDaily, performDailyAction, getUncompletedDailies } = require('../middleware/dailyMiddleware');

// POST endpoint for creating a new daily
router.post('/dailies', checkAuth, createDaily);
router.post('/dailies/:dailyId/perform', checkAuth, performDailyAction);
router.get('/dailies/uncompleted', checkAuth, getUncompletedDailies);

module.exports = router;