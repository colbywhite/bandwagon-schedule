import superjson from "superjson";

import { mockHttpEvent } from "@redwoodjs/testing/api";

import { handler } from "./schedule";

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-functions

describe("schedule function", () => {
  it("should respond with 200", async () => {
    const httpEvent = mockHttpEvent({ queryStringParameters: {} });

    const response = await handler(httpEvent, null);
    expect(response.statusCode).toBe(200);
    const data = superjson.parse(response.body);
    const dates = Object.keys(data);
    expect(dates).toEqual(["2022-08-07", "2022-08-08", "2022-08-09"]);
  });

  // You can also use scenarios to test your api functions
  // See guide here: https://redwoodjs.com/docs/testing#scenarios
  //
  // scenario('Scenario test', async () => {
  //
  // })
});
