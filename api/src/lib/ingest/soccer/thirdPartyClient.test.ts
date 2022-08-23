import thirdPartyClient from "src/lib/ingest/soccer/thirdPartyClient";
import path from "path";
import { setupTestsWithMockHelper } from "src/lib/test.utils";

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
    it("should return only valid games", async () => {
      helper.mockSchedule("scheduleWithInvalidGames.json");
      const schedule = await thirdPartyClient.getMLSSchedule();
      const slugs = schedule.map((g) => g.slug);
      const expectedSlugs = [
        "skcvsoma-06-22-2022",
        "cinvsorl-06-24-2022",
        "forvstor-06-04-2022",
        "nycvsatl-09-14-2022",
        "guavsnyc-02-15-2022",
        "nycvspum-08-11-2021",
      ];
      expect(slugs).toEqual(expectedSlugs);
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
      const expectedTeamRecords = helper.readJsonFixture("filteredStandings.json");
      expect(teamRecords).toEqual(expectedTeamRecords);
    });
  });
});
