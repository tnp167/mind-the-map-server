const knex = require("knex")(require("../knexfile").development);

const createRoute = async (routeData) => {
  const userExists = await knex("users")
    .where({ id: routeData.user_id })
    .first();

  if (!userExists) {
    throw new Error("User with provided user_id does not exist.");
  }

  try {
    const [insertedRoute] = await knex("routes")
      .insert(routeData)
      .returning("*");

    return insertedRoute;
  } catch (error) {
    throw new Error(`Failed to create route: ${error.message}`);
  }
};

const getRouteById = async (routeId) => {
  try {
    const route = await knex("routes").where({ id: routeId }).first();
    return route;
  } catch (error) {
    throw error;
  }
};

const updateRoute = async (routeId, updatedData) => {
  try {
    const [updatedRoute] = await knex("routes")
      .where({ id: routeId })
      .update(updatedData)
      .returning("*");
    return updatedRoute;
  } catch (error) {
    throw error;
  }
};

const deleteRoute = async (routeId) => {
  try {
    const deletedCount = await knex("routes").where({ id: routeId }).del();

    if (deletedCount === 0) {
      throw new Error(`Route with ID ${routeId} not found.`);
    }
    return {
      success: true,
      message: `Route with ID ${routeId} deleted successfully.`,
    };
  } catch (error) {
    console.error(`Error deleting route with ID ${routeId}:`, error.message);
    return { success: false, error: error.message };
  }
};
module.exports = {
  createRoute,
  getRouteById,
  updateRoute,
  deleteRoute,
};
