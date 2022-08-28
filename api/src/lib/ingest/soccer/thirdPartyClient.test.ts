import thirdPartyClient from "src/lib/ingest/soccer/thirdPartyClient";
import path from "path";
import { setupTestsWithMockHelper } from "src/lib/test.utils";
import { DateTime } from "luxon";

describe("ingest/soccer/thirdPartyClient", () => {
  const helper = setupTestsWithMockHelper(path.join(__dirname, "fixtures"));

  describe("getRankings", () => {
    it("should return parsed rankings", async () => {
      helper.mockRankings("defaultRankings.html");
      const rankings = await thirdPartyClient.getRankings();
      const expectedRankings = helper.readJsonFixture("powerrankings.json");
      expect(rankings).toEqual(expectedRankings);
    });
  });

  describe("getMLSSchedule", () => {
    const slugsOfValidGames = [
      "skcvsoma-06-22-2022",
      "cinvsorl-06-24-2022",
      "forvstor-06-04-2022",
      "nycvsatl-09-14-2022",
      "guavsnyc-02-15-2022",
      "nycvspum-08-11-2021",
    ];

    it("should return only valid games", async () => {
      helper.mockSchedule("scheduleWithInvalidGames.json");
      // Use wide time range to focus test on game validity
      const min = DateTime.fromISO("2000-01-01");
      const max = DateTime.fromISO("2100-01-01");
      const schedule = await thirdPartyClient.getMLSSchedule(min, max);
      const slugs = schedule.map((g) => g.slug);
      expect(slugs).toEqual(slugsOfValidGames);
    });

    it("should return only games within time range", async () => {
      helper.mockSchedule("scheduleWithInvalidGames.json");
      const min = DateTime.fromISO("2022-06-22");
      const max = DateTime.fromISO("2022-06-24T24:00:00.000-05:00");
      const schedule = await thirdPartyClient.getMLSSchedule(min, max);
      const slugs = schedule.map((g) => g.slug);
      expect(slugs).toEqual(["skcvsoma-06-22-2022", "cinvsorl-06-24-2022"]);
    });
  });

  describe("getMLSStandings", () => {
    type FilteredTeamRecordStats = {
      total_draws: number;
      total_wins: number;
      total_losses: number;
    };
    type TeamRecords = Record<string, FilteredTeamRecordStats>;

    it("should return standings", async () => {
      helper.mockStandings("defaultStanding.json");

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
      const expectedTeamRecords = helper.readJsonFixture(
        "filteredStandings.json"
      );
      expect(teamRecords).toEqual(expectedTeamRecords);
    });
  });
});
