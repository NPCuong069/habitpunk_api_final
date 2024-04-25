// middleware/notificationMiddleware.js
const cron = require('node-cron');
const { getPendingNotifications, updateNotificationStatus } = require('../models/notificationModel');
const fcm = require('./fcm'); // Assuming you have a module for handling FCM

cron.schedule('* * * * *', async () => {
  try {
    const notifications = await getPendingNotifications();
    notifications.forEach(async notification => {
      // Send notification using FCM
      const result = await fcm.send(notification);
      if (result.success) {
        await updateNotificationStatus(notification.id, true);
      }
    });
  } catch (error) {
    console.error('Error handling notifications:', error);
  }
});
