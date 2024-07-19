const users = require("../models/usersModel");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authentication = require("../middleware/auth");

router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      const emptyFields = [];
      if (!firstname) emptyFields.push("first name");
      if (!lastname) emptyFields.push("last name");
      if (!email) emptyFields.push("email");
      if (!password) emptyFields.push("password");
      const error = `Please fill in the required fields: ${emptyFields.join(
        ", "
      )}`;
      return res.status(400).json({ error });
    }
    const newUser = await users.createUser(req.body, res);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.message.includes("duplicate key value")) {
      res.status(409).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await users.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      process.env.JWT,
      {
        expiresIn: "6h",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", authentication, async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  try {
    const updatedUser = await users.updateUser(userId, updatedData);

    const token = jwt.sign(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        picture: updatedUser.picture,
      },
      process.env.JWT,
      { expiresIn: "6h" }
    );

    res.status(200).json({ user: updatedUser, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/check-username/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const available = await users.checkUsername(username);
    res.status(200).json({ available });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id/picture", async (req, res) => {
  const userId = req.params.id;
  const updatedPicture = req.body;

  try {
    const updatedUser = await users.updatePicture(userId, updatedPicture);

    const token = jwt.sign(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        picture: updatedUser.picture,
      },
      process.env.JWT,
      { expiresIn: "6h" }
    );
    res.status(200).json({ user: updatedUser, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
