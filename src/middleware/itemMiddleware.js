const { getAllItemsWithOwnership, purchaseItem, getItemById } = require('../models/itemModel');

exports.getItemsForUser = async (req, res) => {
  const userId = req.user.uid; // Assuming the user ID is stored in req.user when authenticated
  try {
    const items = await getAllItemsWithOwnership(userId);
    res.json(items);
  } catch (error) {
    console.error('Error in getting items:', error);
    res.status(500).send({ message: "Failed to retrieve items", error: error.message });
  }
};

exports.buyItem = async (req, res) => {
    const userId = req.user.uid;
    const { itemId } = req.params;
  
    try {
      const item = await getItemById(itemId);
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
  
      const result = await purchaseItem(userId, itemId, item.coin);
      if (result.success) {
        res.status(200).send({ message: "Item purchased successfully" });
      } else {
        res.status(400).send({ message: result.message });
      }
    } catch (error) {
      console.error('Error purchasing item:', error);
      res.status(500).send({ message: "Failed to purchase item", error: error.message });
    }
  };