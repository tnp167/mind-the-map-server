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
      .get(`/api/tfl/journey`)
      .query({
        startLat: "51.530882",
        startLon: "0.0957",
        endLat: "51.5054",
        endLon: "0.0235",
      })
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

  it("should return crowding data when naptan id is provided", async () => {
    const crowdingData = {
      dataAvailable: true,
      percentageOfBaseline: 0.43,
    };

    const naptanId = "940GZZLUKSL";

    tfl.fetchCrowdingData.mockResolvedValue(crowdingData);

    await request(app)
      .get(`/api/tfl/crowding/${naptanId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.dataAvailable).toBe(true);
        expect(res.body.percentageOfBaseline).toBe(0.43);
      });
  });

  it("should return line status wheb mode is provided", async () => {
    const lineStatusData = [
      {
        id: "bakerloo",
        modeName: "tube",
        lineStatuses: [
          {
            statusSeverity: 6,
          },
        ],
      },
      {
        id: "central",
        modeName: "tube",
        lineStatuses: [
          {
            statusSeverity: 5,
          },
        ],
      },
    ];

    const mode = "tube";
    tfl.fetchLineStatusData.mockResolvedValue(lineStatusData);
    await request(app)
      .get(`/api/tfl/status/${mode}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();

        expect(res.body[0].id).toBe("bakerloo");
        expect(res.body[0].lineStatuses).toBeDefined();
        expect(res.body[0].lineStatuses[0].statusSeverity).toBe(6);

        expect(res.body[1].id).toBe("central");
        expect(res.body[1].lineStatuses).toBeDefined();
        expect(res.body[1].lineStatuses[0].statusSeverity).toBe(5);
      });
  });
});
