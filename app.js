const express = require("express");
const app = express();
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const routeRoutes = require("./routes/routeRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
require("dotenv").config();
const PORT = process.env.PORT || 8080;

const cors_origin = process.env.CORS_ORIGIN;

app.use(cors(cors_origin));

app.use(express.json({ limit: "50mb" }));

app.use("/user", userRoutes);
app.use("/route", routeRoutes);
app.use("/weather", weatherRoutes);

module.exports = app;
