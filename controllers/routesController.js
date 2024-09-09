const authentication = require("../middleware/auth");
const routes = require("../models/routesModel");
const router = require("express").Router();

router.post("/bookmark", authentication, async (req, res) => {
  try {
    const { start_point, end_point } = req.body;
    const userId = req.user.id;

    if (!start_point || !end_point || !userId) {
      return res.status(400).json({ error });
    }
    const newRoute = await routes.createRoute(req.body, userId);
    res.status(201).json(newRoute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/userId", authentication, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const allRoute = await routes.getRouteByUserId(userId);

    if (!allRoute) {
      return res.status(404).json({ error: "Route not found" });
    }

    res.status(200).json(allRoute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", authentication, async (req, res) => {
  try {
    const userId = req.user.id;
    const routeId = req.params.id;
    const { name } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!routeId) {
      return res.status(400).json({ error: "Route ID not existed" });
    }

    const route = await routes.getRouteByRouteId(routeId);
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    if (route.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Forbidden: You can only update your own routes." });
    }

    const updatedRoute = await routes.updateRoute(routeId, name);
    res.status(200).json(updatedRoute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", authentication, async (req, res) => {
  try {
    const userId = req.user.id;
    const routeId = req.params.id;

    if (!routeId) {
      return res.status(400).json({ error: "Route ID not existed" });
    }
    const route = await routes.getRouteByRouteId(routeId);
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    if (route.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Forbidden: You can only update your own routes." });
    }

    const deletedRoute = await routes.deleteRoute(routeId);
    res.status(200).json(deletedRoute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
