// middleware/notificationMiddleware.js
const cron = require('node-cron');
const { getPendingNotifications, updateNotificationStatus, getNotificationsToBeSent, createNotification } = require('../models/notificationModel');
const admin = require('../config/firebaseAdminInit');

exports.addNewNotification = async (req, res) => {
  const {  device_type, content, daily_id, scheduled_time } = req.body;
  const daily = await getDailyById(daily_id);
  if (!daily) {
    return res.status(404).send({ message: "Daily not found" });
  }

  const user_id = daily.user_id;
  try {
    const notification = await createNotification({
      user_id,
      device_type,
      content,
      daily_id,
      scheduled_time
    });

    res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).send({ message: "Failed to create notification", error: error.message });
  }
};
exports.checkAndSendNotifications = async () => {
  const notifications = await getNotificationsToBeSent();
  console.log(`Attempting to send ${notifications.length} notifications`);
  notifications.forEach(notification => {
      sendNotification(notification);
      console.log(`Sending notification with token ${notification.device_token}`);
  });
};

const sendNotification = async (notification) => {
  const message = {
    notification: {
      title: 'Scheduled Notification',
      body: notification.content
    },
    token: notification.device_token
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};