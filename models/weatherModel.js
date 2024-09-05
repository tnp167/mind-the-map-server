const axios = require("axios");

const fetchWeatherData = async (lat, lon, apiKey) => {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    return data;
  } catch (error) {
    throw new Error("Error fetching weather data");
  }
};

module.exports = {
  fetchWeatherData,
};
