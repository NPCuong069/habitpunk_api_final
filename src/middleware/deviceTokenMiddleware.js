const { upsertDeviceToken } = require('../models/deviceTokenModel');
const admin = require('firebase-admin');
const handleDeviceToken = async (req, res) => {
    console.log('Running');
    const { token, deviceToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    console.log('devicetoken: ', deviceToken);
    if (!deviceToken) {
        return res.status(400).send({ message: 'Device token is required.' });
    }
    try {
        await upsertDeviceToken(firebaseUid, deviceToken);
    } catch (error) {
        console.error('Error updating device token:', error);
        res.status(500).send({ message: "Failed to update device token", error: error.message });
    }
};

module.exports = {
    handleDeviceToken
};
