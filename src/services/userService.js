const { findById } = require('../models/userModel');
const { create } = require('../models/userModel');
// const userModel = require('../models/userModel');

async function createUser(user) {
  return await create(user);
}

async function findUserById(userId) {
  return await findById(userId);
}

async function modifyUser(user) {
  return await updateUser(user.id, user);
}

module.exports = { createUser, findUserById, modifyUser };
