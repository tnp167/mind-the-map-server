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

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "route ID not existed" });
    }

    const route = await routes.deleteRoute(id);
    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
