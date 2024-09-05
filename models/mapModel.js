const axios = require("axios");

const fetchMapData = async (lat, lon, apiKey) => {
  try {
    const { data } = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${apiKey}`
    );
    return data;
  } catch {
    throw new Error("Error fetching weather data");
  }
};

module.exports = {
  fetchMapData,
};
