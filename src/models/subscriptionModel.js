const db = require('../config/database'); // Make sure this path is correct.

const getActiveSubscriptionByUserId = async (userId) => {
    console.log("Fetching active subscription for user ID:", userId); // Debug log
    if (!userId) {
        console.error('User ID is undefined.');
        return null; // Return null or throw an error as appropriate
    }

    try {
        const result = await db('subscriptions')
            .where({
                user_id: userId,
                status: 'active'
            })
            .andWhere('end_date', '>=', db.fn.now())
            .orderBy('end_date', 'desc')
            .first();
        return result; // return the latest active subscription if any
    } catch (err) {
        console.error('Error fetching active subscription:', err);
        throw err;
    }
};

const addSubscription = async (userId, months) => {
    const existingSubscription = await getActiveSubscriptionByUserId(userId);
    if (existingSubscription) {
        throw new Error('Active subscription already exists.');
    }

    const startDate = new Date();
    const endDate = new Date(startDate.setMonth(startDate.getMonth() + months));

    try {
        const result = await db('subscriptions').insert({
            user_id: userId,
            start_date: startDate,
            end_date: endDate,
            status: 'active',
        }).returning('*'); // Return the inserted subscription data
        return result[0];
    } catch (err) {
        console.error('Error adding subscription:', err);
        throw err;
    }
};

module.exports = {
    getActiveSubscriptionByUserId,
    addSubscription
};
