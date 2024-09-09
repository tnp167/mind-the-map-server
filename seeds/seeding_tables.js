/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const users = require("../seed_data/users");
const routes = require("../seed_data/routes");

exports.seed = async function (knex) {
  await knex("users").del();
  await knex("users").insert(users);
  await knex("routes").del();
  await knex("routes").insert(routes);
};
