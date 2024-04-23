const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/authMiddleware');
const { getItemsForUser, buyItem } = require('../middleware/itemMiddleware');

// Route to get all items with ownership information
router.get('/items', checkAuth, getItemsForUser);
router.post('/items/:itemId/purchase', checkAuth, buyItem);
module.exports = router;