const subscriptionModel = require('../models/subscriptionModel');

const getCurrentActiveSubscription = async (req, res) => {
    const userId = req.user.uid; // Assuming user ID is attached to req.user
    try {
        const subscription = await subscriptionModel.getActiveSubscriptionByUserId(userId);
        if (!subscription) {
            return res.status(404).send({ message: "No active subscription found." });
        }
        res.json(subscription);
    } catch (error) {
        res.status(500).send({ message: "Failed to retrieve subscription", error: error.message });
    }
};

const addNewSubscription = async (req, res) => {
    const userId = req.user.uid; // Assuming user ID is attached to req.user
    const { months } = req.body; // Number of months for the subscription

    if (!months || months <= 0) {
        return res.status(400).send({ message: "Invalid number of months." });
    }

    try {
        const subscription = await subscriptionModel.addSubscription(userId, months);
        res.status(200).json(subscription);
    } catch (error) {
        if (error.message === 'Active subscription already exists.') {
            res.status(409).send({ message: error.message });
        } else {
            res.status(500).send({ message: "Failed to add subscription", error: error.message });
        }
    }
};
module.exports = {
    getCurrentActiveSubscription,
    addNewSubscription
};