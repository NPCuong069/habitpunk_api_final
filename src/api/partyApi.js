const express = require('express');
const router = express.Router();
const { createParty, getPartyMembers, getPartyByUser, getPartyDetails } = require('../middleware/partyMiddleware');
const { checkAuth } = require('../middleware/authMiddleware');  // Assuming you have an authentication middleware

router.post('/party/create', checkAuth, createParty);
router.get('/party/:partyId/members', checkAuth, getPartyMembers);
router.get('/party/user', checkAuth, getPartyByUser); 
router.get('/party/details',checkAuth, getPartyDetails);
module.exports = router;
