const express = require('express');
const router = express.Router();
const { createNotification, getNotificationById } = require('../models/notificationModel');
const { checkAuth } = require('../middleware/authMiddleware');
const { addNewNotification, getNotificationsByDaily, deleteNotification } = require('../middleware/notificationMiddleware');

router.post('/notifications', checkAuth, addNewNotification);
router.delete('/notifications/:id', checkAuth, deleteNotification);
router.get('/notifications/daily/:daily_id', checkAuth, getNotificationsByDaily);

module.exports = router;
