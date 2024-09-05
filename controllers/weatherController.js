const weather = require("../models/weatherModel");
const router = require("express").Router();

const openweatherAccessToken = process.env.OPENWEATHER_ACCESS_TOKEN;

router.get("/", async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const weatherData = await weather.fetchWeatherData(
      lat,
      lon,
      openweatherAccessToken
    );
    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).send("Error fetching weather data");
  }
});

module.exports = router;
