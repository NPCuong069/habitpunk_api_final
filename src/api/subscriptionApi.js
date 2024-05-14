const express = require('express');
const router = express.Router();
const {addNewSubscription, getCurrentActiveSubscription} = require('../middleware/subscriptionMiddleware');
const { checkAuth } = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

router.get('/subscription/current', checkAuth, getCurrentActiveSubscription);
router.post('/subscription', checkAuth, addNewSubscription);

module.exports = router;