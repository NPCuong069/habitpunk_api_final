const express = require('express');
const { checkAuth } = require('../middleware/authMiddleware');
const { handleAddNewMessage, handleAddNewSystemMessage, handleDeleteMessage, handleFetchMessagesByUserId } = require('../middleware/chatMiddleware');
const router = express.Router();

router.post('/message', checkAuth, handleAddNewMessage);
router.post('/system-message', checkAuth, handleAddNewSystemMessage);
router.delete('/message/:messageId', checkAuth, handleDeleteMessage);
router.get('/messages', checkAuth, handleFetchMessagesByUserId);

module.exports = router;
