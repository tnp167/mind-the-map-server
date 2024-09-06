const router = require("express").Router();
const tfl = require("../models/tflModel");

router.get("/journey", async (req, res) => {
  const { start, end } = req.query;
  try {
    const journeyData = await tfl.fetchJourneyData(start, end);
    res.status(200).json(journeyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
