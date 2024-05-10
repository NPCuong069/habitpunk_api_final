const cron = require('node-cron');
const { checkAndSendNotifications } = require('../middleware/notificationMiddleware');
const { resetDailyChecks } = require('../models/dailyModel');



exports.startCronJob = () => {
  cron.schedule('* * * * *', async () => {
    console.log(`Cron job running at ${new Date().toISOString()}`);
    await checkAndSendNotifications();
  });
  cron.schedule('0 0 * * *', async () => {
    console.log(`Resetting daily checks at midnight: ${new Date().toISOString()}`);
    await resetDailyChecks();
  }, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
  });
};