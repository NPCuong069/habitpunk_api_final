// middleware/notificationMiddleware.js
const cron = require('node-cron');
const { getPendingNotifications, updateNotificationStatus, getNotificationsToBeSent, createNotification, getNotificationsByDailyId, getNotificationById, deleteNotification } = require('../models/notificationModel');
const admin = require('../config/firebaseAdminInit');
const { getDailyById } = require('../models/dailyModel');

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
exports.deleteNotification = async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  try {
    // Check if the notification exists
    const notification = await getNotificationById(id);
    if (!notification) {
      return res.status(404).send({ message: "Notification not found" });
    }

    // Delete the notification
    await deleteNotification(id);

    res.status(200).send({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).send({ message: "Failed to delete notification", error: error.message });
  }
};
exports.getNotificationsByDaily = async (req, res) => {
  const { daily_id } = req.params;

  if (!daily_id) {
    return res.status(400).json({ message: 'Daily ID must be provided' });
  }

  try {
    const notifications = await getNotificationsByDailyId(daily_id);
    res.json(notifications);
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    res.status(500).json({ message: "Failed to retrieve notifications", error: error.message });
  }
};