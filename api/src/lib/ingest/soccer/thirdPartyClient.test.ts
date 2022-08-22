import {
  getMLSSchedule,
  getMLSStandings,
  getRankings,
} from "src/lib/ingest/soccer/thirdPartyClient";
import path from "path";
import {
  FixtureLoader,
  restWithBody,
  restWithJson,
  setupTestsWithServer,
} from "src/lib/test.utils";

describe("ingest/soccer/thirdPartyClient", () => {
  const server = setupTestsWithServer();
  const fixtures = new FixtureLoader(path.join(__dirname, "fixtures"));

  describe("getRankings", () => {
    const url =
      "http://www.powerrankingsguru.com/soccer/mls/team-power-rankings.php";

    it("should return parsed rankings", async () => {
      server.use(restWithBody(url, fixtures.readData("powerrankings.html")));
      const rankings = await getRankings();
      const expectedRankings = fixtures.readJsonData("powerrankings.json");
      expect(rankings).toEqual(expectedRankings);
    });
  });

  describe("getMLSSchedule", () => {
    const url = "https://sportapi.mlssoccer.com/api/matches";

    it("should return only valid games", async () => {
      server.use(
        restWithJson(
          url,
          fixtures.readJsonData("scheduleWithInvalidGames.json")
        )
      );

      const schedule = await getMLSSchedule();
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
    const url = "https://sportapi.mlssoccer.com/api/standings/live";
    type FilteredTeamRecordStats = {
      total_draws: number;
      total_wins: number;
      total_losses: number;
    };
    type TeamRecords = Record<string, FilteredTeamRecordStats>;

    it("should return standings", async () => {
      server.use(restWithJson(url, fixtures.readJsonData("standings.json")));

      const standings = await getMLSStandings();
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
      const expectedTeamRecords = fixtures.readJsonData(
        "filteredStandings.json"
      );
      expect(teamRecords).toEqual(expectedTeamRecords);
    });
  });
});
