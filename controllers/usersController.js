const Users = require("../models/usersModel");

const createUser = async (req, res) => {
  try {
    const newUser = await Users.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
};
