import superjson from "superjson";

import { mockHttpEvent } from "@redwoodjs/testing/api";

import { handler } from "./schedule";
import type { BuiltSchedule } from "./schedule";
import { setupTestsWithMockHelper } from "src/lib/test.utils";
import path from "path";
import { DateTime } from "luxon";

describe("schedule function", () => {
  const server = setupTestsWithMockHelper(
    path.join(__dirname, "..", "..", "lib", "ingest", "soccer", "fixtures")
  );
  const httpEvent = mockHttpEvent({ queryStringParameters: {} });

  beforeEach(() => {
    server.mockAll("scheduleFromApr19ToApr20.json");
  });

  it("should include build time", async () => {
    const expectedBuildTime = new Date();
    const response = await handler(httpEvent, null);
    expect(response.statusCode).toBe(200);
    const { buildTime } = superjson.parse<BuiltSchedule>(response.body);
    const diff = DateTime.fromJSDate(buildTime).diff(
      DateTime.fromJSDate(expectedBuildTime)
    );
    expect(diff.seconds).toBeCloseTo(0);
  });

  it("should include schedule", async () => {
    const response = await handler(httpEvent, null);
    expect(response.statusCode).toBe(200);
    const { schedule } = superjson.parse<BuiltSchedule>(response.body);
    expect(schedule.games).toBeDefined();
    expect(schedule.teams).toBeDefined();
    expect(schedule.gamesByDate).toBeDefined();
    expect(schedule.gamesByTeam).toBeDefined();
  });
});
