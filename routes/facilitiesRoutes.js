const express = require("express");
const router = express.Router();
const facilitesController = require("../controllers/facilitiesController");

router.route("/restaurants").get(facilitesController);
router.route("/toilets").get(facilitesController);

module.exports = router;
