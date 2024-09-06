const express = require("express");
const router = express.Router();

const tflController = require("../controllers/tflController");

router.route("/journey").get(tflController);

module.exports = router;
