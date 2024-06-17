const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.route("/register").post(usersController.createUser);

module.exports = router;
