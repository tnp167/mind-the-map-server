const users = require("../models/usersModel");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authentication = require("../middleware/auth");
const {
  upload,
  generateSignedUrl,
  deleteObject,
} = require("../config/s3Utils");

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

    if (user.picture) {
      const signedUrl = await generateSignedUrl(user.picture);
      user.pictureUrl = signedUrl;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        picture: user.picture,
        pictureUrl: user.pictureUrl,
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
        pictureUrl: updatedUser.pictureUrl,
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

router.patch("/:id/picture", upload.single("picture"), async (req, res) => {
  const userId = req.params.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const pictureName = file.key;
    const signedUrl = await generateSignedUrl(file.key);

    const user = await users.getUserById(userId);
    if (user.picture) {
      await deleteObject(user.picture);
    }

    const updatedUser = await users.updatePicture(
      userId,
      signedUrl,
      pictureName
    );

    const token = jwt.sign(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        picture: pictureName,
        pictureUrl: signedUrl,
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
