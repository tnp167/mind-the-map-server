const axios = require("axios");

const restaurantBaseUrl = process.env.RESTAURANT_BASE_URL;
const toiletBaseUrl = process.env.TOILET_BASE_URL;

const fetchRestaurantsList = async (lat, lng, apiKey) => {
  try {
    const options = {
      params: {
        latitude: lat,
        longitude: lng,
        distance: "0.5",
      },
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
      },
    };
    const { data } = await axios.get(restaurantBaseUrl, options);
    return data;
  } catch (error) {
    throw new Error("Error fetching restaurants list");
  }
};

const fetchToiletsList = async (lat, lng, apiKey) => {
  try {
    const options = {
      params: {
        lat: lat,
        lng: lng,
      },
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "public-bathrooms.p.rapidapi.com",
      },
    };
    const { data } = await axios.get(toiletBaseUrl, options);
    return data;
  } catch (error) {
    throw new Error("Error fetching toilets list");
  }
};

module.exports = {
  fetchRestaurantsList,
  fetchToiletsList,
};
