const router = require("express").Router();
const map = require("../models/mapModel");

const mapboxAccessToken = process.env.MAPBOXGL_ACCESS_TOKEN;

router.get("/", async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const mapData = await map.fetchMapData(lat, lon, mapboxAccessToken);
    res.status(200).json(mapData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
