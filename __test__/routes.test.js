const knexConfig = require("../knexfile").test;
const knex = require("knex")(knexConfig);
const request = require("supertest");
const routes = require("../models/routesModel");
const users = require("../models/usersModel");
const app = require("../app");
const jwt = require("jsonwebtoken");

describe("Routes Table", () => {
  let userId;
  let authToken;
  const testRouteData = {
    user_id: userId,
    start_point: "51.5054,0.0235",
    end_point: "51.530882,0.0957",
    name: "Test",
  };

  const userData = {
    firstname: "testfirstname",
    lastname: "testlastname",
    password: "testpassword",
    email: "testuser@example.com",
  };

  beforeAll(async () => {
    await knex.migrate.latest();
    const newUser = await users.createUser(userData);
    userId = newUser.id;
    authToken = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        picture: newUser.picture,
        pictureUrl: newUser.pictureUrl,
      },
      process.env.JWT,
      { expiresIn: "24h" }
    );
  });

  afterAll(async () => {
    await knex("routes").where({ user_id: userId }).del();
    await knex("users").where({ id: userId }).del();
    await knex.destroy();
  });

  it("should insert a new route", async () => {
    testRouteData.user_id = userId;

    const response = await request(app)
      .post("/route/bookmark")
      .send(testRouteData)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.start_point).toBe(testRouteData.start_point);
    expect(response.body.end_point).toBe(testRouteData.end_point);
    expect(response.body.user_id).toBe(testRouteData.user_id);
  });

  it("should retrieve a route by user ID", async () => {
    testRouteData.user_id = userId;

    const response = await request(app)
      .get("/route/userId")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body[0].start_point).toBe(testRouteData.start_point);
    expect(response.body[0].end_point).toBe(testRouteData.end_point);
    expect(response.body[0].user_id).toBe(testRouteData.user_id);
  });

  it("should update name of route", async () => {
    const newRoute = await routes.createRoute(testRouteData, userId);

    const updatedRouteData = {
      name: "testname2",
    };

    const response = await request(app)
      .patch(`/route/${newRoute.id}`)
      .send(updatedRouteData)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.name).toBe(updatedRouteData.name);
  });

  // it("should delete a route by ID", async () => {
  //   testRouteData.user_id = userId;

  //   const newRoute = await routes.createRoute(testRouteData);

  //   const deletionResult = await routes.deleteRoute(newRoute.id);

  //   expect(deletionResult.success).toBe(true);
  //   expect(deletionResult.message).toContain(
  //     `Route with ID ${newRoute.id} deleted successfully.`
  //   );

  //   const deletedRoute = await knex("routes")
  //     .where({ id: newRoute.id })
  //     .first();
  //   expect(deletedRoute).toBeUndefined();
  // });
});
