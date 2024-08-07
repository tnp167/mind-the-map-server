const knexConfig = require("../knexfile").test;
const knex = require("knex")(knexConfig);
const request = require("supertest");
const users = require("../models/usersModel");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const authentication = require("../middleware/auth");

app.get("/user", authentication, async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

describe("Users Table", () => {
  let testUserData;

  beforeAll(async () => {
    await knex.migrate.latest();
    testUserData = {
      firstname: `testfirstname_${Date.now()}`,
      lastname: `testlastname_${Date.now()}`,
      password: "testpassword",
      email: `test${Date.now()}@hotmail.com`,
    };
  });

  beforeEach(async () => {
    await knex("users").delete();
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await knex.destroy();
  });

  it("should insert a new user", async () => {
    const insertedUser = await users.createUser(testUserData);

    expect(insertedUser).toBeDefined();
    expect(insertedUser.first_name).toBe(testUserData.firstname);
    expect(insertedUser.last_name).toBe(testUserData.lastname);
    expect(insertedUser.email).toBe(testUserData.email);
  });

  it("should retrieve a user by ID", async () => {
    const newUser = await users.createUser(testUserData);
    const insertedUser = await users.getUserById(newUser.id);
    expect(insertedUser).toBeDefined();
    expect(insertedUser.email).toBe(testUserData.email);
  });

  it("should update a user", async () => {
    const newUser = await users.createUser(testUserData);
    const updatedUserData = {
      firstname: "updatefirstname",
      lastname: "updatelastname",
      username: "update",
    };
    const updatedUser = await users.updateUser(newUser.id, updatedUserData);
    expect(updatedUser).toBeDefined();
    expect(updatedUser.first_name).toBe(updatedUserData.firstname);
    expect(updatedUser.last_name).toBe(updatedUserData.lastname);
  });

  it("should return a valid token", async () => {
    const payload = {
      id: 1,
      email: "testuser3@example.com",
      firstname: "testFirst",
      lastname: "testLast",
    };
    const token = jwt.sign(payload, process.env.JWT, {
      expiresIn: "1h",
    });

    const response = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.user.id).toBe(payload.id);
    expect(response.body.user.email).toBe(payload.email);
    expect(response.body.user.firstname).toBe(payload.firstname);
    expect(response.body.user.lastname).toBe(payload.lastname);
  });

  it("should update a user picture and picture URL", async () => {
    const newUser = await users.createUser(testUserData);

    const updatedPicture = {
      signedUrl: "https://example.com/signed-url",
      pictureName: "new-picture.jpg",
    };

    const updatedUser = await users.updatePicture(
      newUser.id,
      updatedPicture.signedUrl,
      updatedPicture.pictureName
    );

    expect(updatedUser).toBeDefined();
    expect(updatedUser.picture).toBe(updatedPicture.pictureName);
    expect(updatedUser.pictureUrl).toBe(updatedPicture.signedUrl);
  });
});
