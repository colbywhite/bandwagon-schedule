import path from "path";
import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";

import getOriginalSchedule from "./";
import {
  BASKETBALL_URLS,
  FixtureHelper,
  jsonResponse,
  mockResponsesBeforeEach,
  textResponse,
} from "../../test.utils";

// Auto set a wide time frame since that's not what we're testing here
const getSchedule = getOriginalSchedule.bind(
  null,
  DateTime.fromISO("2000-01-01"),
  DateTime.fromISO("2100-01-01")
);

const fixtures = new FixtureHelper(path.join(__dirname, "fixtures"));
const defaultRankingsResponse = () =>
  textResponse(BASKETBALL_URLS.rankings, fixtures.text("defaultRankings.html"));
const defaultTeamsResponse = () =>
  jsonResponse(BASKETBALL_URLS.teams, fixtures.json("defaultTeams.json"));

describe("ingest/basketball", () => {
  const server = mockResponsesBeforeEach(
    defaultRankingsResponse(),
    defaultTeamsResponse()
  );

  it.todo("should parse venue cities");

  it.todo("should parse competition name");

  it("should parse game time", async () => {
    server.use(
      jsonResponse(
        BASKETBALL_URLS.schedule,
        fixtures.json("scheduleWithGameOnNov15.json")
      )
    );
    const [game] = await getSchedule();
    expect(game.gameTime).toEqual(new Date("2022-11-16T00:30:00Z"));
  });
});
