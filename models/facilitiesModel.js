const axios = require("axios");

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
    const response = await axios.get(
      "https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng",
      options
    );
    return response.data;
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
    const response = await axios.get(
      "https://public-bathrooms.p.rapidapi.com/location",
      options
    );
    return response.data;
  } catch (error) {
    throw new Error("Error fetching toilets list");
  }
};

module.exports = {
  fetchRestaurantsList,
  fetchToiletsList,
};
