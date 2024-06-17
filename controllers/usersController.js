const users = require("../models/usersModel");
const router = require("express").Router();

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

module.exports = router;
