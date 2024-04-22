// api/userApi.js
const express = require('express');
const router = express.Router();
const { loginUserOrCreate, getAllUsersHandler, verifyAndCreateUser, updateExperience, getUserInfo } = require('../middleware/userMiddleware');
const {checkAuth} = require('../middleware/authMiddleware');
const {completeDailyTask} = require('../middleware/dailyMiddleware');

router.get('/users', getAllUsersHandler);
router.post('/user', verifyAndCreateUser);
router.post('/user/:userId/experience', checkAuth, updateExperience);
router.post('/login', loginUserOrCreate);
router.get('/user/info', checkAuth, getUserInfo);
router.post('/dailies/:dailyId/complete', completeDailyTask);
router.get('/secure-route', checkAuth, (req, res) => {
    res.send('This is a secure route accessible only to authenticated users.');
  });
module.exports = router;
