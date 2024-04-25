const { getAllUsers, getUserByFirebaseUid, updateUser, createUser } = require('../models/userModel');
const generateNickname = require('../utils/generateNickname');
const admin = require('firebase-admin');
const userModel = require('../models/userModel');

const getAllUsersHandler = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving users from the database." });
  }
};
const updateExperience = async (userId, expToAdd) => {
  try {
    const result = await userModel.updateExperience(userId, expToAdd);
    return result; // Return the result to the caller, or handle as needed
  } catch (error) {
    console.error('Error updating user experience:', error);
    throw error; // Re-throw or handle error appropriately
  }// Optionally return new values for confirmation/testing
};

exports.updateUserHealthMana = async (userId, hpChange, enChange) => {
  await db('users').where({ firebase_uid: userId }).increment('hp', hpChange).increment('en', enChange);
};
const verifyAndCreateUser = async (req, res, next) => {
  const { token } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    let user = await getUserByFirebaseUid(firebaseUid);
    if (!user) {
      const newUser = {
        firebase_uid: firebaseUid,
        username: decodedToken.name || 'DefaultUsername', // Default in case the token doesn't include a name
        email: decodedToken.email
      };
      user = await createUser(newUser);
      res.status(201).json(user[0]);
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
  }
};
const getUserInfo = async (req, res) => {
  const firebaseUid = req.user.uid; // UID from decoded Firebase token

  try {
    const user = await userModel.getUserByFirebaseUid(firebaseUid);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    console.error('Error retrieving user information:', error);
    res.status(500).send('Internal server error');
  }
};

const loginUserOrCreate = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).send('Token is required.');
  }

  console.log("Token received:", token);
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    let user = await userModel.getUserByFirebaseUid(firebaseUid);

    if (!user) {
      const username = await generateNickname(decodedToken.email);
      const newUser = {
        firebase_uid: firebaseUid,
        username,
        email: decodedToken.email,
        lvl: 1,
        xp: 0,
        en: 100,
        coin: 0,
        hp: 50,
        hat_id: 0,
        costume_id: 0,
        facial_id: 0,
        weapon_id: 0,
        background_id: 0,
        pet_id: 0,
        cape_id: 0,
        chip_id: 0,
        login_time: new Date(),
        created_at: new Date()
      };
      user = await userModel.createUser(newUser);
      res.status(201).json({ message: "User created and logged in", user: user[0] });
    } else {
      await userModel.updateUser(user.id, { login_time: new Date() });
      user = await userModel.getUserByFirebaseUid(firebaseUid); // Fetch the updated user info
      res.status(200).json({ message: "Login successful", user });
    }
  } catch (error) {
    console.error('Error during login or user creation:', error);
    res.status(403).send('Invalid token or server error');
  }
};

module.exports = {
  getAllUsersHandler,
  verifyAndCreateUser,
  updateExperience,
  loginUserOrCreate,
  getUserInfo,
  updateExperience
};
