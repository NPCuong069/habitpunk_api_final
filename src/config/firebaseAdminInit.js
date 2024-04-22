const admin = require('firebase-admin');
const serviceAccount = require('../key/projectfinal-f539b-firebase-adminsdk-f17jd-6bca58e305.json');  // Adjust the path as necessary

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
