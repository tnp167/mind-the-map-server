const request = require("supertest");
const app = require("../app");
const map = require("../models/mapModel");

jest.mock("../models/mapModel");

describe("Map API controller", () => {
  it("should return location data when valid coordinates are provided", async () => {
    const mapData = {
      type: "FeatureCollection",
      query: [51.530882, 0.0957],
      features: [
        {
          id: "address.4548513221488630",
          type: "Feature",
        },
      ],
    };

    map.fetchMapData.mockResolvedValue(mapData);

    await request(app)
      .get("/api/map")
      .query({ lat: "51.530882", lon: "0.0957" })
      .expect(200)
      .expect((res) => {
        expect(res.body.type).toBe("FeatureCollection");

        expect(res.body.query).toBeDefined();
        expect(Array.isArray(res.body.query)).toBe(true);
        expect(res.body.query[0]).toEqual(mapData.query[0]);
        expect(res.body.query[1]).toEqual(mapData.query[1]);

        expect(res.body.features).toBeDefined();
        expect(Array.isArray(res.body.features)).toBe(true);
        expect(res.body.features.length).toEqual(mapData.features.length);

        expect(res.body.features[0].id).toEqual(mapData.features[0].id);
        expect(res.body.features[0].type).toEqual("Feature");
      });
  });
});
