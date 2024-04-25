// api/notificationApi.js
const express = require('express');
const router = express.Router();
const { createNotification, deleteNotification } = require('../models/notificationModel');

// POST endpoint to create a notification
router.post('/notifications', async (req, res) => {
  try {
    const { time, content, daily_id } = req.body;
    const notification = await createNotification({ time, content, daily_id });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE endpoint to delete a notification
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
