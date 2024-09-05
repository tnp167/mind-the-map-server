const express = require("express");
const app = express();
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const routeRoutes = require("./routes/routeRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const facilitiesRoutes = require("./routes/facilitiesRoutes");
require("dotenv").config();
const PORT = process.env.PORT || 8080;

const cors_origin = process.env.CORS_ORIGIN;

app.use(cors(cors_origin));

app.use(express.json({ limit: "50mb" }));

app.use("/user", userRoutes);
app.use("/route", routeRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/facilities", facilitiesRoutes);

module.exports = app;
