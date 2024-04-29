const db = require('../config/database');

const createInvitation = async (partyId, userId, status) => {
    const existingInvitation = await db('invitations')
        .where({ party_id: partyId, user_id: userId, status: 1 })
        .first();

    if (existingInvitation) {
        throw new Error('An invitation for this party with the same user already exists and is accepted.');
    }
    const [invitation] = await db('invitations').insert({
        party_id: partyId,
        user_id: userId,
        status: status
    }).returning('*');
    return invitation;
};

const getInvitationsByUserId = async (userId) => {
    try {
        const invitations = await db('invitations')
            .where('invitations.user_id', userId)
            .andWhere('invitations.status', 1)  // Filtering invitations that are active/not declined
            .join('party', 'party.id', 'invitations.party_id')  // Join to fetch party details
            .join('users', 'users.firebase_uid', 'party.leader_id')  // Join to fetch user details (assuming the leader sent the invitation)
            .select('invitations.id', 'party.name as partyName', 'users.username as inviterName', 'invitations.status');  // Selecting fields to return

        return invitations;
    } catch (error) {
        console.error('Failed to retrieve invitations for user:', userId, error);
        throw error;  // Rethrow or handle error as needed
    }
};
const acceptInvitation = async (invitationId) => {
    const updated = await db('invitations')
        .where({ id: invitationId })
        .update({ status: 1 }) // Assuming status 1 means accepted
        .returning('*');
    return updated[0];
};
const getPartyIdByInvitationId = async (invitationId) => {
    const invitation = await db('invitations').where({ id: invitationId }).first();
    if (invitation) {
        return invitation.party_id;
    } else {
        throw new Error('Invitation not found');
    }
};
const declineInvitation = async (invitationId) => {
    const updated = await db('invitations')
        .where({ id: invitationId })
        .update({ status: 2 }) // Assuming status 2 means declined
        .returning('*');
    return updated[0];
};
module.exports = {
    createInvitation,
    getInvitationsByUserId,
    acceptInvitation,
    declineInvitation,
    getPartyIdByInvitationId
};