const express = require('express');
const router = express.Router();
const { addPartyQuest } = require('../middleware/partyQuestMiddleware');
const { checkAuth } = require('../middleware/authMiddleware');  

router.post('/partyQuest', checkAuth, addPartyQuest);

module.exports = router;