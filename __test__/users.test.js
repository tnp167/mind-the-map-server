const knexConfig = require("../knexfile").test;
const knex = require("knex")(knexConfig);

const users = require("../models/usersModel");
describe("Users Table", () => {
  beforeAll(async () => {
    await knex.migrate.latest();
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await knex.destroy();
  });

  it("should insert a new user", async () => {
    const testUserData = {
      firstname: "testfirstname",
      lastname: "testlastname",
      password: "testpassword",
      email: "testuser@example.com",
    };

    const insertedUser = await users.createUser(testUserData);

    expect(insertedUser).toBeDefined();
    expect(insertedUser.first_name).toBe(testUserData.firstname);
    expect(insertedUser.last_name).toBe(testUserData.lastname);
    expect(insertedUser.email).toBe(testUserData.email);
  });

  it("should retrieve a user by email", async () => {
    const testUserData = {
      firstname: "testfirstname",
      lastname: "testlastname1",
      password: "testpassword",
      email: "testuser0@example.com",
    };

    const newUser = await users.createUser(testUserData);
    const insertedUser = await users.getUserByEmail(newUser.email);
    expect(insertedUser).toBeDefined();
    expect(insertedUser.email).toBe(testUserData.email);
  });

  it("should retrieve a user by ID", async () => {
    const testUserData = {
      firstname: "testfirstname",
      lastname: "testlastname",
      password: "testpassword",
      email: "testuser1@example.com",
    };
    const newUser = await users.createUser(testUserData);
    const insertedUser = await users.getUserById(newUser.id);
    expect(insertedUser).toBeDefined();
    expect(insertedUser.email).toBe(testUserData.email);
  });

  it("should update a user", async () => {
    let testUserData = {
      firstname: "testfirstname",
      lastname: "testlastname",
      password: "testpassword",
      email: "testuser2@example.com",
    };
    const newUser = await users.createUser(testUserData);
    const updatedUserData = {
      email: "updateduser@example.com",
    };
    const updatedUser = await users.updateUser(newUser.id, updatedUserData);
    expect(updatedUser).toBeDefined();
    expect(updatedUser.email).toBe(updatedUserData.email);
  });
});
