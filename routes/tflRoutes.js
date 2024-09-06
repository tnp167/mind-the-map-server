const express = require("express");
const router = express.Router();

const tflController = require("../controllers/tflController");

router.route("/journey").get(tflController);
router.route("/crowding/:id").get(tflController);
router.route("/status").get(tflController);

module.exports = router;
