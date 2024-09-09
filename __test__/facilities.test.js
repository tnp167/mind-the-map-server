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
          location_id: 12065149,
          name: "Maderla",
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
        expect(res.body.data.length).toEqual(restaurantsData.data.length);
      });
  });

  it("should return toilets list when valid coordinates are provided", async () => {
    const toiletsData = [
      {
        id: 53409,
        name: "University of East London",
        street: "University Way",
      },
      { id: 51731, name: "Abbey Arms", street: "Wilton Road" },
    ];

    facilities.fetchToiletsList.mockResolvedValue(toiletsData);

    await request(app)
      .get("/api/facilities/toilets")
      .query({ lat: "51.530882", lon: "0.0957" })
      .expect((res) => {
        expect(res.body[0]).toBeDefined();
        expect(res.body[0].name).toEqual(toiletsData[0].name);
        expect(res.body.length).toEqual(toiletsData.length);
      });
  });
});
