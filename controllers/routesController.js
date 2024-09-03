const routes = require("../models/routesModel");
const router = require("express").Router();

router.post("/bookmark", async (req, res) => {
  try {
    const { start_point, end_point, user_id } = req.body;

    if (!start_point || !end_point || !user_id) {
      return res.status(400).json({ error });
    }
    const newRoute = await routes.createRoute(req.body, res);
    res.status(201).json(newRoute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/userId/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const allRoute = await routes.getRouteByUserId(userId);

    if (!allRoute) {
      return res.status(404).json({ error: "Route not found" });
    }

    res.status(201).json(allRoute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    if (!id) {
      return res.status(400).json({ error: "route ID not existed" });
    }

    const route = await routes.updateRoute(id, name);
    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
