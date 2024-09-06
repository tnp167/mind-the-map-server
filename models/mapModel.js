const axios = require("axios");

const mapboxBaseUrl = process.env.MAPBOXGL_BASE_URL;

const fetchMapData = async (lat, lon, apiKey) => {
  try {
    const { data } = await axios.get(
      `${mapboxBaseUrl}${lon},${lat}.json?access_token=${apiKey}`
    );
    return data;
  } catch {
    throw new Error("Error fetching map data");
  }
};

module.exports = {
  fetchMapData,
};
