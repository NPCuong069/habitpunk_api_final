const db = require('../config/database');

const addNewMessage = async (partyId, userId, content) => {
    return db('chat').insert({
        party_id: partyId,
        user_id: userId,
        content: content,
        is_deleted: false
    }).returning('*');
};

const addNewSystemMessage = async (partyId, content) => {
    return db('chat').insert({
        party_id: partyId,
        content: content,
        is_deleted: false
    }).returning('*');
};

const deleteMessage = async (messageId) => {
    return db('chat')
        .where({ id: messageId })
        .update({ is_deleted: true })
        .returning('*');
};

const fetchMessagesByUserId = async (userId) => {
    return db('chat')
        .join('users', 'users.firebase_uid', '=', 'chat.user_id') // Join to validate user exists and fetch party_id
        .select('chat.*')
        .where('users.firebase_uid', userId)
        .andWhere('chat.is_deleted', false)
        .andWhere('chat.party_id', function() {
            this.select('party_id')
                .from('users')
                .where('firebase_uid', userId)
                .first(); // Subquery to get the party_id for the user
        });
};


module.exports = {
    addNewMessage,
    addNewSystemMessage,
    deleteMessage,
    fetchMessagesByUserId
};
