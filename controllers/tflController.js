const router = require("express").Router();
const tfl = require("../models/tflModel");

router.get("/journey", async (req, res) => {
  const { startLat, startLon, endLat, endLon } = req.query;
  try {
    const journeyData = await tfl.fetchJourneyData(
      startLat,
      startLon,
      endLat,
      endLon
    );
    res.status(200).json(journeyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/crowding/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const crowdingData = await tfl.fetchCrowdingData(id);
    res.status(200).json(crowdingData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/status/:mode", async (req, res) => {
  const { mode } = req.params;
  try {
    const status = await tfl.fetchLineStatusData(mode);
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
