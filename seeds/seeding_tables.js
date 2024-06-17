/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const users = require("../seed_data/users");

exports.seed = async function (knex) {
  await knex("users").del();
  await knex("users").insert(users);
};
