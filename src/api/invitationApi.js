const express = require('express');
const router = express.Router();
const { handleCreateInvitation, getInvitationsByUser, handleAcceptInvitation, handleDeclineInvitation } = require('../middleware/invitationMiddleware');
const { checkAuth } = require('../middleware/authMiddleware'); // Assuming you have an authentication middleware

router.post('/invitations', checkAuth, handleCreateInvitation);
router.get('/invitations', checkAuth, getInvitationsByUser);
router.put('/invitations/accept/:invitationId', checkAuth, handleAcceptInvitation);
router.put('/invitations/decline/:invitationId', checkAuth, handleDeclineInvitation);
module.exports = router;
