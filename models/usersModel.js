const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "development"]
);

require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (userData) => {
  const {
    firstname: first_name,
    lastname: last_name,
    email,
    password,
  } = userData;

  if (!first_name || !last_name || !email || !password) {
    const emptyFields = [];
    if (!first_name) emptyFields.push("first name");
    if (!last_name) emptyFields.push("last name");
    if (!email) emptyFields.push("email");
    if (!password) emptyFields.push("password");
    throw new Error(
      `Please fill in the required fields: ${emptyFields.join(", ")}`
    );
  }

  const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})$/;

  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format.");
  }

  const hashedPassword = bcrypt.hashSync(password, 6);

  try {
    const existingUser = await knex("users").where({ email: email }).first();
    if (existingUser) {
      throw new Error("This email is already taken");
    }

    const newUser = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
    };

    const insertedUser = await knex("users").insert(newUser).returning("*");
    return insertedUser[0];
  } catch (error) {
    console.error("Error inserting user:", error.message);
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const user = await knex("users").where({ id: userId }).first();
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (userEmail) => {
  try {
    const user = await knex("users").where({ email: userEmail }).first();
    return user;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userId, updatedData) => {
  try {
    const [updatedUser] = await knex("users")
      .where({ id: userId })
      .update({
        first_name: updatedData.firstname,
        last_name: updatedData.lastname,
        username: updatedData.username,
        updated_at: knex.fn.now(),
      })
      .returning("*");
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const checkUsername = async (username) => {
  try {
    const user = await knex("users").where({ username: username }).first();
    return user === undefined;
  } catch (error) {
    throw new Error(error);
  }
};

const updatePicture = async (userId, signedUrl, pictureName) => {
  try {
    const [updatedUser] = await knex("users")
      .where({ id: userId })
      .update({
        picture: pictureName,
        pictureUrl: signedUrl,
        updated_at: knex.fn.now(),
      })
      .returning("*");
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  checkUsername,
  updatePicture,
};
