const knex = require('../config/database');
const moment = require('moment');
const admin = require('../config/firebaseAdminInit');
const db = require('../config/database');

const getNotificationsToBeSent = () => {
  const currentTime = moment().utc().format('HH:mm');

  return db('notifications')
    .join('user_device_tokens', 'notifications.user_id', '=', 'user_device_tokens.user_id')
    .select('notifications.content', 'user_device_tokens.device_token')
    .whereRaw(`to_char(notifications.scheduled_time, 'HH24:MI') = ?`, [currentTime])
};

const createNotification = async (notification) => {
  return db('notifications').insert(notification).returning('*');
};
const getNotificationsByDailyId = async (dailyId) => {
  try {
    return await db('notifications').where({ daily_id: dailyId });
  } catch (error) {
    throw new Error('Failed to retrieve notifications: ' + error.message);
  }
};
const getPendingNotifications = async () => {
  return db('notifications')
    .where('status', false)
    .andWhere('time', '<=', new Date().toISOString());
};
const getNotificationById = (id) => {
  return db('notifications').where({ id }).first();
};
const updateNotificationStatus = async (id, status) => {
  return db('notifications')
    .where({ id })
    .update({ status })
    .returning('*');
};
const deleteNotification = async (id) => {
  return db('notifications').where('id', id).del();
};
module.exports = {
  createNotification,
  getPendingNotifications,
  updateNotificationStatus,
  deleteNotification,
  getNotificationById,
  getNotificationsToBeSent,
  getNotificationsByDailyId
};
