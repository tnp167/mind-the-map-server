const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT;

const authentication = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized. Please login" });
  }

  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, jwtKey, (error, decoded) => {
    if (error) {
      return res
        .status(403)
        .json({ error: "User does not have access rights to the content" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authentication;
