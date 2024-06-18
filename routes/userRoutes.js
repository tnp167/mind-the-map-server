const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.route("/register").post(usersController);
router.route("/login").post(usersController);
router.route("/").get(usersController);
module.exports = router;
