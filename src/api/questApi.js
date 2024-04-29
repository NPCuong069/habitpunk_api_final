const express = require('express');
const router = express.Router();
const { sendAllQuests } = require('../middleware/questMiddleware');

router.get('/quests', sendAllQuests);

module.exports = router;
