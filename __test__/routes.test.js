const knexConfig = require("../knexfile").test;
const knex = require("knex")(knexConfig);

const routes = require("../models/routesModel");
const users = require("../models/usersModel");

describe("Routes Table", () => {
  let userId;
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
  });

  afterAll(async () => {
    await knex("routes").where({ user_id: userId }).del();
    await knex("users").where({ id: userId }).del();
    await knex.destroy();
  });

  it("should insert a new route", async () => {
    testRouteData.user_id = userId;

    await routes.createRoute(testRouteData);

    const insertedRoute = await routes.createRoute(testRouteData);

    expect(insertedRoute).toBeDefined();
    expect(insertedRoute.start_point).toBe(testRouteData.start_point);
    expect(insertedRoute.end_point).toBe(testRouteData.end_point);
    expect(insertedRoute.user_id).toBe(testRouteData.user_id);
  });

  it("should retrieve a route by user ID", async () => {
    testRouteData.user_id = userId;

    const newRoute = await routes.createRoute(testRouteData);
    const retrievedRoute = await routes.getRouteByUserId(userId);

    expect(retrievedRoute).toBeDefined();
    expect(retrievedRoute[0].start_point).toBe(newRoute.start_point);
    expect(retrievedRoute[0].end_point).toBe(newRoute.end_point);
    expect(retrievedRoute[0].user_id).toBe(newRoute.user_id);
  });

  it("should update name of route", async () => {
    testRouteData.user_id = userId;

    const newRoute = await routes.createRoute(testRouteData);

    const updatedRouteData = {
      name: "testname2",
    };
    const updatedRoute = await routes.updateRoute(
      newRoute.id,
      updatedRouteData.name
    );

    expect(updatedRoute).toBeDefined();
    expect(updatedRoute.name).toBe(updatedRouteData.name);
  });

  it("should delete a route by ID", async () => {
    testRouteData.user_id = userId;

    const newRoute = await routes.createRoute(testRouteData);

    const deletionResult = await routes.deleteRoute(newRoute.id);

    expect(deletionResult.success).toBe(true);
    expect(deletionResult.message).toContain(
      `Route with ID ${newRoute.id} deleted successfully.`
    );

    const deletedRoute = await knex("routes")
      .where({ id: newRoute.id })
      .first();
    expect(deletedRoute).toBeUndefined();
  });
});
