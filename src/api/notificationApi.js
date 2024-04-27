const express = require('express');
const router = express.Router();
const { createNotification, deleteNotification } = require('../models/notificationModel');
const { checkAuth } = require('../middleware/authMiddleware');
const { addNewNotification } = require('../middleware/notificationMiddleware');

router.post('/notifications', checkAuth, addNewNotification);

router.delete('/notifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteNotification(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
