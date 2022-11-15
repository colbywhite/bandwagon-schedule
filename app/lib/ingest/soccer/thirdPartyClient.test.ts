import path from "path";
import { describe, expect, it } from "vitest";
import thirdPartyClient from "./thirdPartyClient";
import {
  FixtureHelper,
  jsonResponse,
  mockResponsesBeforeEach,
  SOCCER_URLS,
  textResponse,
} from "../../test.utils";
import { DateTime } from "luxon";

const fixtures = new FixtureHelper(path.join(__dirname, "fixtures"));
describe("ingest/soccer/thirdPartyClient", () => {
  describe("getRankings", () => {
    mockResponsesBeforeEach(
      textResponse(SOCCER_URLS.rankings, fixtures.text("defaultRankings.html"))
    );

    it("should return parsed rankings", async () => {
      const rankings = await thirdPartyClient.getRankings();
      const expectedRankings = fixtures.json("powerrankings.json");
      expect(rankings).toEqual(expectedRankings);
    });
  });

  describe("getMLSSchedule", () => {
    mockResponsesBeforeEach(
      jsonResponse(
        SOCCER_URLS.schedule,
        fixtures.json("scheduleWithInvalidGames.json")
      )
    );

    it("should return only valid games", async () => {
      const slugsOfValidGames = [
        "skcvsoma-06-22-2022",
        "cinvsorl-06-24-2022",
        "forvstor-06-04-2022",
        "nycvsatl-09-14-2022",
        "guavsnyc-02-15-2022",
        "nycvspum-08-11-2021",
      ];
      // Use wide time range to focus test on game validity
      const min = DateTime.fromISO("2000-01-01");
      const max = DateTime.fromISO("2100-01-01");
      const schedule = await thirdPartyClient.getMLSSchedule(min, max);
      const slugs = schedule.map((g) => g.slug);
      expect(slugs).toEqual(slugsOfValidGames);
    });

    it("should return only games within time range", async () => {
      const min = DateTime.fromISO("2022-06-22");
      const max = DateTime.fromISO("2022-06-24T24:00:00.000-05:00");
      const schedule = await thirdPartyClient.getMLSSchedule(min, max);
      const slugs = schedule.map((g) => g.slug);
      expect(slugs).toEqual(["skcvsoma-06-22-2022", "cinvsorl-06-24-2022"]);
    });
  });

  describe("getMLSStandings", () => {
    mockResponsesBeforeEach(
      jsonResponse(SOCCER_URLS.standings, fixtures.json("defaultStanding.json"))
    );
    type FilteredTeamRecordStats = {
      total_draws: number;
      total_wins: number;
      total_losses: number;
    };
    type TeamRecords = Record<string, FilteredTeamRecordStats>;

    it("should return standings", async () => {
      const standings = await thirdPartyClient.getMLSStandings();
      const teamRecords = standings.reduce((teams, entry) => {
        return {
          ...teams,
          [entry.club.abbreviation]: {
            total_draws: entry.statistics.total_draws,
            total_wins: entry.statistics.total_wins,
            total_losses: entry.statistics.total_losses,
          },
        };
      }, {} as TeamRecords);
      const expectedTeamRecords = fixtures.json("filteredStandings.json");
      expect(teamRecords).toEqual(expectedTeamRecords);
    });
  });
});
