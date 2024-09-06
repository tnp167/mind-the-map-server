const axios = require("axios");

const TflBaseUrl = process.env.TFL_BASE_URL;

const fetchJourneyData = async (startLat, startLon, endLat, endLon) => {
  try {
    const { data } = await axios.get(
      `${TflBaseUrl}/Journey/JourneyResults/${startLat},${startLon}/to/${endLat},${endLon}`
    );

    return data;
  } catch {
    throw new Error("Error fetching data");
  }
};

const fetchCrowdingData = async (naptanId) => {
  try {
    const { data } = await axios.get(`${TflBaseUrl}/crowding/${naptanId}/live`);
    return data;
  } catch {
    throw new Error("Error fetching data");
  }
};

const fetchLineStatusData = async (mode) => {
  try {
    const { data } = await axios.get(`${TflBaseUrl}/line/mode/${mode}/status`);
    return data;
  } catch {
    throw new Error("Error fetching data");
  }
};
module.exports = {
  fetchJourneyData,
  fetchCrowdingData,
  fetchLineStatusData,
};
