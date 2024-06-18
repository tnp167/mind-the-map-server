const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

require("dotenv").config();
const PORT = process.env.PORT || 8080;

const cors_origin = process.env.CORS_ORIGIN;

app.use(cors(cors_origin));

app.use(express.json());

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;
