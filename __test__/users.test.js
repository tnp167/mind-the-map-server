const knexConfig = require("../knexfile").test;
const knex = require("knex")(knexConfig);
const request = require("supertest");
const users = require("../models/usersModel");
const app = require("../app");
const jwt = require("jsonwebtoken");

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
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        picture: newUser.picture,
        pictureUrl: newUser.pictureUrl,
        username: newUser.username,
      },
      process.env.JWT,
      { expiresIn: "24h" }
    );

    const updatedUserData = {
      firstname: "updatefirstname",
      lastname: "updatelastname",
      username: "update",
    };

    const response = await request(app)
      .patch(`/user/${newUser.id}`)
      .send(updatedUserData)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.first_name).toBe(updatedUserData.firstname);
    expect(response.body.user.last_name).toBe(updatedUserData.lastname);
    expect(response.body.user.username).toBe(updatedUserData.username);
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

    let authToken = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        picture: newUser.picture,
        pictureUrl: newUser.pictureUrl,
        username: newUser.username,
      },
      process.env.JWT,
      { expiresIn: "24h" }
    );

    const response = await request(app)
      .patch(`/user/${newUser.id}/picture`)
      .set("Authorization", `Bearer ${authToken}`)
      .attach("picture", Buffer.from("test image content"), "test.jpg");

    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.picture).toBeDefined();
    expect(response.body.user.picture.length).toBe(32);
    expect(response.body.user.pictureUrl).toBeDefined();
    expect(
      response.body.user.pictureUrl.startsWith(
        "https://mind-the-map-user-picture.s3"
      )
    ).toBe(true);
  });
});
