const knex = require("knex")(require("../knexfile").development);

const createUser = async (userData) => {
  try {
    const insertedUser = await knex("users").insert(userData).returning("*");
    return insertedUser[0];
  } catch (error) {
    if (error.code === "23505" || error.detail.includes("already exists")) {
      console.error("Duplicate email:", userData.email);
      throw new Error("Email address already exists");
    } else {
      console.error("Error inserting user:", error.message);
      throw error;
    }
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

const updateUser = async (userId, updatedData) => {
  try {
    const [updatedUser] = await knex("users")
      .where({ id: userId })
      .update(updatedData)
      .returning("*");
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
};
