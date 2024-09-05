const request = require("supertest");
const app = require("../app");
const weather = require("../models/weatherModel");

jest.mock("../models/weatherModel");

describe("Weather API controller", () => {
  it("should return weather data when valid coordinates are provided", async () => {
    const weatherData = {
      coord: { lon: 0.0235, lat: 51.5054 },
      weather: [
        {
          id: 300,
          main: "Drizzle",
          description: "light intensity drizzle",
          icon: "09d",
        },
        { id: 701, main: "Mist", description: "mist", icon: "50d" },
      ],
    };

    weather.fetchWeatherData.mockResolvedValue(weatherData);

    await request(app)
      .get("/api/weather")
      .query({ lat: "51.5054", lon: "0.0235" })
      .expect(200)
      .expect((res) => {
        expect(res.body.weather).toBeDefined();
        expect(res.body.weather).toEqual(weatherData.weather);
      });
  });
});
