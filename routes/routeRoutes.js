const express = require("express");
const router = express.Router();
const routesController = require("../controllers/routesController");

router.route("/bookmark").post(routesController);
router.route("/userId/:id").get(routesController);
router.route("/:id").patch(routesController);
router.route("/:id").delete(routesController);

module.exports = router;
