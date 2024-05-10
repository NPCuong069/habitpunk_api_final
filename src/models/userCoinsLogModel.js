const db = require('../config/database');

const logCoinChange = async (userId, coins) => {
    return db('user_coins_log').insert({
        user_id: userId,
        coins: coins,
        date_added: new Date() // Using JavaScript Date object to ensure the timestamp is generated accurately
    });
};
const getTodaysCoins = async (userId) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return db('user_coins_log')
        .where('user_id', userId)
        .andWhere('date_added', '>=', todayStart)
        .andWhere('date_added', '<=', todayEnd)
        .sum('coins as total')
        .then(results => results[0].total || 0);
};
module.exports = {
    logCoinChange,
    getTodaysCoins
};