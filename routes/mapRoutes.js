const express = require("express");
const router = express.Router();
const mapController = require("../controllers/mapController");

router.route("/").get(mapController);

module.exports = router;
