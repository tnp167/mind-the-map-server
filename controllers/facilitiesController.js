const router = require("express").Router();
const facilities = require("../models/facilitiesModel");

const rapidAccessToken = process.env.RAPID_API_ACCESS_TOKEN;

router.get("/restaurants", async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const restaurantsList = await facilities.fetchRestaurantsList(
      lat,
      lon,
      rapidAccessToken
    );

    res.status(200).json(restaurantsList);
  } catch (error) {
    res.status(500).send("Error fetching weather data");
  }
});

module.exports = router;
