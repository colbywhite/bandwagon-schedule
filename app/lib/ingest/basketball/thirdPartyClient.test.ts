import path from "path";
import { describe, expect, it } from "vitest";
import thirdPartyClient from "./thirdPartyClient";
import {
  BASKETBALL_URLS,
  FixtureHelper,
  jsonResponse,
  mockResponsesBeforeEach,
  textResponse,
} from "../../test.utils";
import { DateTime } from "luxon";

const fixtures = new FixtureHelper(path.join(__dirname, "fixtures"));
describe("ingest/basketball/thirdPartyClient", () => {
  describe("getRankings", () => {
    mockResponsesBeforeEach(
      textResponse(
        BASKETBALL_URLS.rankings,
        fixtures.text("defaultRankings.html")
      )
    );

    it("should return parsed rankings", async () => {
      const rankings = await thirdPartyClient.getRankings();
      const expectedRankings = fixtures.json("powerrankings.json");
      expect(rankings).toEqual(expectedRankings);
    });
  });

  describe("getNBASchedule", () => {
    mockResponsesBeforeEach(
      jsonResponse(
        BASKETBALL_URLS.schedule,
        fixtures.json("scheduleWithInvalidGames.json")
      )
    );

    it("should return only valid games", async () => {
      const idsOfValidGames = ["1653841", "1653842"];
      // Use wide time range to focus test on game validity
      const min = DateTime.fromISO("2000-01-01");
      const max = DateTime.fromISO("2100-01-01");
      const schedule = await thirdPartyClient.getNBASchedule(min, max);
      const ids = schedule.map((g) => g.idEvent);
      expect(ids).toEqual(idsOfValidGames);
    });

    it("should return only games within time range", async () => {
      const min = DateTime.fromISO("2022-10-01T00:00:00.000", {
        zone: "America/New_York",
      });
      const max = DateTime.fromISO("2022-10-18T21:00:00.000", {
        zone: "America/New_York",
      });
      const schedule = await thirdPartyClient.getNBASchedule(min, max);
      const slugs = schedule.map((g) => g.idEvent);
      expect(slugs).toEqual(["1653841"]);
    });
  });

  describe("getNBATeams", () => {
    mockResponsesBeforeEach(
      jsonResponse(BASKETBALL_URLS.teams, fixtures.json("defaultTeams.json"))
    );

    it("should return teams", async () => {
      const teams = await thirdPartyClient.getNBATeams();
      const abbreviations = teams.map((t) => t.strTeamShort);
      expect(abbreviations).toEqual(fixtures.json("teamAbbreviations.json"));
    });
  });
});
