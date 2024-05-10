const express = require('express');
const router = express.Router();
const { loginUserOrCreate, getAllUsersHandler, verifyAndCreateUser, updateExperience, getUserInfo, updateUserEquipment, leavePartyHandler } = require('../middleware/userMiddleware');
const { checkAuth } = require('../middleware/authMiddleware');
const { handleDeviceToken } = require('../middleware/deviceTokenMiddleware');

router.get('/users', getAllUsersHandler);
router.post('/user', verifyAndCreateUser);
router.post('/user/:userId/experience', checkAuth, updateExperience);
router.post('/login', loginUserOrCreate, handleDeviceToken);
router.get('/user/info', checkAuth, getUserInfo);
router.post('/user/equip', checkAuth, updateUserEquipment);
router.post('/user/leave-party', checkAuth, leavePartyHandler);
router.get('/secure-route', checkAuth, (req, res) => {
  res.send('This is a secure route accessible only to authenticated users.');
});
module.exports = router;
