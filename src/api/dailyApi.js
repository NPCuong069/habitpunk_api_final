const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/authMiddleware');
const { createDaily, performDailyAction, getUncompletedDailies, updateDailyNote, deleteDaily } = require('../middleware/dailyMiddleware');

// POST endpoint for creating a new daily
router.post('/dailies', checkAuth, createDaily);
router.post('/dailies/:dailyId/perform', checkAuth, performDailyAction);
router.get('/dailies/uncompleted', checkAuth, getUncompletedDailies);
router.patch('/dailies/:dailyId/description', checkAuth, updateDailyNote);
router.delete('/dailies/:dailyId', checkAuth, deleteDaily); 
module.exports = router;