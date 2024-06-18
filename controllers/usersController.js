const users = require("../models/usersModel");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

    const token = jwt.sign({ id: user.id, email: email }, process.env.JWT, {
      expiresIn: "6h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
