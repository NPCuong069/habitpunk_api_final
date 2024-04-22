const admin = require('../config/firebaseAdminInit');  // Ensure the path is correct

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('You are not authorized');
  }
};

module.exports = {checkAuth};
