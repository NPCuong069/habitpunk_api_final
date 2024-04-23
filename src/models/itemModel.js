const db = require('../config/database');

exports.getAllItemsWithOwnership = async (userId) => {
  try {
    const items = await db('items')
      .leftJoin('user_items', function() {
        this.on('items.id', '=', 'user_items.itemid')
           .andOn('user_items.userid', '=', db.raw('?', [userId]))
      })
      .select('items.*', db.raw('CASE WHEN user_items.id IS NOT NULL THEN true ELSE false END as owned'));

    return items;
  } catch (error) {
    console.error('Error fetching items with ownership status:', error);
    throw error;
  }
};
exports.getItemById = async (itemId) => {
    return db('items').where({ id: itemId }).first();
  };
  
exports.purchaseItem = async (userId, itemId, itemCost) => {
    const result = await db.transaction(async trx => {
      const user = await trx('users').where({ firebase_uid: userId }).forUpdate().select('coin').first();
      if (user.coin >= itemCost) {
        // Deduct the item cost from user's coins
        await trx('users').where({ firebase_uid: userId }).update({ coin: user.coin - itemCost });
        // Add item to user's inventory
        await trx('user_items').insert({ userid: userId, itemid: itemId });
        return { success: true };
      } else {
        return { success: false, message: 'Not enough coins' };
      }
    });
  
    return result;
  };