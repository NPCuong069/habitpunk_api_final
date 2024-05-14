const { addNewMessage, addNewSystemMessage, deleteMessage, fetchMessagesByUserId } = require('../models/chatModel');

exports.handleAddNewMessage = async (req, res) => {
    try {
        const { partyId, content } = req.body;
        const userId = req.user.firebaseUid; // Assuming the user ID is stored in req.user
        const message = await addNewMessage(partyId, userId, content);
        res.json(message);
    } catch (error) {
        res.status(500).send({ message: 'Failed to send message', error: error.message });
    }
};

exports.handleAddNewSystemMessage = async (req, res) => {
    try {
        const { partyId, content } = req.body;
        const message = await addNewSystemMessage(partyId, content);
        res.json(message);
    } catch (error) {
        res.status(500).send({ message: 'Failed to send system message', error: error.message });
    }
};

exports.handleDeleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await deleteMessage(messageId);
        res.json(message);
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete message', error: error.message });
    }
};

exports.handleFetchMessagesByUserId = async (req, res) => {
    try {
        const  userId  = req.user.uid;
        const messages = await fetchMessagesByUserId(userId);
        res.json(messages);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch messages', error: error.message });
    }
};
