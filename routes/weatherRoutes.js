const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

router.route("/").get(weatherController);

module.exports = router;
