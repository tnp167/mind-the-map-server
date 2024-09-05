const request = require("supertest");
const app = require("../app");
const facilities = require("../models/facilitiesModel");

jest.mock("../models/facilitiesModel");

describe("Facilities API controller", () => {
  it("should return restaurants list when valid coordinates are provided", async () => {
    const restaurantsData = {
      data: [
        { location_id: 21399866, name: "Krispy Kreme" },
        {
          location_id: 21399866,
          name: "Krispy Kreme",
        },
      ],
    };
    facilities.fetchRestaurantsList.mockResolvedValue(restaurantsData);

    await request(app)
      .get("/api/facilities/restaurants")
      .query({ lat: "51.530882", lon: "0.0957" })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeDefined();
        expect(res.body.data[0].location_id).toEqual(
          restaurantsData.data[0].location_id
        );
      });
  });
});
