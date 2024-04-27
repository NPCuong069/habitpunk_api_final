const cron = require('node-cron');
const { checkAndSendNotifications } = require('../middleware/notificationMiddleware');



exports.startCronJob = () => {
    cron.schedule('* * * * *', async () => {
      console.log(`Cron job running at ${new Date().toISOString()}`);
      await checkAndSendNotifications();
    });
};