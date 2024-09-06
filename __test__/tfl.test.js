const request = require("supertest");
const app = require("../app");
const tfl = require("../models/tflModel");

jest.mock("../models/tflModel");

describe("TfL API controller", () => {
  it("should return journey when valid coordinates are provided", async () => {
    const journeyData = {
      journey: {
        startDateTime: "2024-09-05T18:05:00",
        duration: 50,
        arrivalDateTime: "2024-09-05T18:55:00",
        legs: [
          {
            duration: 9,
            mode: {
              id: "walking",
            },
          },
        ],
      },
    };

    tfl.fetchJourneyData.mockResolvedValue(journeyData);

    await request(app)
      .get("/api/tfl/journey")
      .query({ lat: "51.530882", lon: "0.0957" })
      .expect(200)
      .expect((res) => {
        expect(res.body.journey).toBeDefined();

        expect(res.body.journey.duration).toEqual(journeyData.journey.duration);
        expect(res.body.journey.startDateTime).toEqual(
          journeyData.journey.startDateTime
        );
        expect(res.body.journey.arrivalDateTime).toEqual(
          journeyData.journey.arrivalDateTime
        );

        expect(res.body.journey.legs.length).toEqual(
          journeyData.journey.legs.length
        );
        expect(res.body.journey.legs[0].duration).toEqual(
          journeyData.journey.legs[0].duration
        );
        expect(res.body.journey.legs[0].mode.id).toEqual(
          journeyData.journey.legs[0].mode.id
        );
      });
  });
});
