// models/notificationModel.js

const knex = require('../config/database');

const createNotification = async (notification) => {
  return knex('notifications').insert(notification).returning('*');
};

const getPendingNotifications = async () => {
  return knex('notifications')
    .where('status', false)
    .andWhere('time', '<=', new Date().toISOString());
};

const updateNotificationStatus = async (id, status) => {
  return knex('notifications')
    .where({ id })
    .update({ status })
    .returning('*');
};
const deleteNotification = async (id) => {
    return knex('notifications').where('id', id).del();
  };
module.exports = {
  createNotification,
  getPendingNotifications,
  updateNotificationStatus,
  deleteNotification
};
