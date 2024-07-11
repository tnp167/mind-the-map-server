const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.route("/register").post(usersController);
router.route("/login").post(usersController);
router.route("/").get(usersController);
router.route("/:id").patch(usersController);

module.exports = router;
