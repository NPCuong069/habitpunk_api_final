const db = require('../config/database');

// Function to add or update device token
const upsertDeviceToken = async (userId, deviceToken) => {
    const exists = await db('user_device_tokens')
        .where({ user_id: userId })
        .first();

    if (exists) {
        return db('user_device_tokens')
            .where({ user_id: userId })
            .update({ device_token: deviceToken, updated_at: new Date() });
    } else {
        return db('user_device_tokens').insert({
            user_id: userId,
            device_token: deviceToken
        });
    }
};

module.exports = {
    upsertDeviceToken
};