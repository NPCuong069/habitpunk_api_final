const { createInvitation, getInvitationsByUserId, declineInvitation, acceptInvitation, getPartyIdByInvitationId } = require('../models/invitationModel');
const { updateUserField, checkUsernameExists, getUserByFirebaseUid } = require('../models/userModel');

exports.handleCreateInvitation = async (req, res, next) => {
    const { username } = req.body; // Username of the user to invite
    const loggedInUserId = req.user.uid; // Logged-in user's Firebase UID

    try {
        // Get partyId from the logged-in user
        const loggedInUser = await getUserByFirebaseUid(loggedInUserId);
        if (!loggedInUser || !loggedInUser.party_id) {
            console.log('Logged-in user does not have an associated party:', loggedInUserId);
            return res.status(400).json({ message: 'Logged-in user does not have an associated party.' });
        }

        // Check if username exists
        const targetUser = await checkUsernameExists(username);
        if (!targetUser) {
            console.log('User with provided username does not exist:', username);
            return res.status(404).json({ message: 'User with the provided username does not exist.' });
        }

        console.log('Creating invitation for user:', targetUser.id);
        const invitation = await createInvitation(loggedInUser.party_id, targetUser.firebase_uid, 1); // Status is set to 1 automatically
        console.log('Invitation created:', invitation);
        res.status(201).json({ message: 'Invitation created successfully', invitation });
    } catch (error) {
        console.error('Error creating invitation:', error);
        res.status(500).json({ message: 'Failed to create invitation', error: error.message });
    }
};

exports.getInvitationsByUser = async (req, res, next) => {
    const userId = req.user.uid; // Change this line to use uid
    try {
        const invitations = await getInvitationsByUserId(userId);
        res.status(200).json(invitations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve invitations', error: error.message });
    }
};
exports.handleAcceptInvitation = async (req, res) => {
    const { invitationId } = req.params;
    const userId = req.user.uid;

    try {
        console.log("Fetching party ID for invitation:", invitationId);
        const partyId = await getPartyIdByInvitationId(invitationId);
        if (!partyId) {
            console.log("No party associated with the invitation:", invitationId);
            return res.status(404).json({ message: "No party found for invitation" });
        }

        // Check the current number of members in the party
        const members = await db('users').where({ party_id: partyId });
        if (members.length >= 4) {  // Assuming the party limit is 4 members
            console.log("Party reach limit member number");
            await declineInvitation(invitationId);  // Update the invitation status to declined
            return res.status(400).json({ message: "Party reach limit member number" });
        }

        console.log("Accepting invitation:", invitationId);
        const invitation = await acceptInvitation(invitationId);
        if (!invitation) {
            console.log("No invitation found with ID:", invitationId);
            return res.status(404).json({ message: "No invitation found" });
        }

        console.log("Updating user's party ID:", userId);
        await updateUserField(userId, 'party_id', partyId);

        console.log("Fetching all user invitations for declination:", userId);
        const userInvitations = await getInvitationsByUserId(userId);
        const declinePromises = userInvitations
            .filter(inv => inv.id !== invitationId) // Exclude the accepted invitation
            .map(inv => declineInvitation(inv.id)); // Map to decline invitation promises
        await Promise.all(declinePromises);

        console.log("Invitation accepted successfully.");
        res.status(200).json({ message: 'Invitation accepted successfully', invitation });
    } catch (error) {
        console.log('Fail:', error.message);
        res.status(500).json({ message: 'Failed to accept invitation', error: error.message });
    }
};


exports.handleDeclineInvitation = async (req, res) => {
    const { invitationId } = req.params;
    try {
        const invitation = await declineInvitation(invitationId);
        res.status(200).json({ message: 'Invitation declined successfully', invitation });
    } catch (error) {
        res.status(500).json({ message: 'Failed to decline invitation', error: error.message });
    }
};