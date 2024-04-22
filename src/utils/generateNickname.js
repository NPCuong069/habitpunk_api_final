const userModel = require('../models/userModel');

const generateNickname = async (email) => {
    let baseUsername = email.substring(0, email.indexOf('@')).toLowerCase();
    baseUsername = baseUsername.replace(/[^a-z0-9]/gi, ''); // Remove non-alphanumeric characters
    let username = baseUsername;
    let counter = 0;

    // Check uniqueness and append a number if necessary
    while (await userModel.checkUsernameExists(username)) {
        counter++;
        username = `${baseUsername}${counter}`;
    }
    return username;
};

module.exports = generateNickname;