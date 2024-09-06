const axios = require("axios");

const TflBaseUrl = process.env.TFL_BASE_URL;

const fetchJourneyData = async (start, end) => {
  try {
    const { data } = await axios.get(
      `${TflBaseUrl}/Journey/JourneyResults/${start}/to/${end}`
    );

    return data;
  } catch {
    throw new Error("Error fetching data");
  }
};

module.exports = {
  fetchJourneyData,
};
