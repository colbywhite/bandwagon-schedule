import getSchedule from "src/lib/ingest/soccer";
import { setupTestsWithMockHelper } from "src/lib/test.utils";
import path from "path";
import { Team } from "types/index";

describe("ingest/soccer", () => {
  const server = setupTestsWithMockHelper(path.join(__dirname, "fixtures"));

  describe("Schedule#games", () => {
    it("should parse english, national tv networks", async () => {
      server.mockAll("scheduleWithDifferentNetworks.json");
      const { games } = await getSchedule();
      const [nationallyTelevisedGame, locallyTelevisedGame] = games;
      expect(nationallyTelevisedGame.network).toEqual("FS1");
      expect(locallyTelevisedGame.network).toBeUndefined();
    });

    it("should parse venue cities", async () => {
      server.mockAll("scheduleWithDifferentLocations.json");
      const { games } = await getSchedule();
      const locations = games.map((g) => g.venue);
      expect(locations).toEqual([
        { name: "Estadio Nacional de Costa Rica", city: "San Jose" },
        { name: "Dick's Sporting Goods Park", city: "Commerce City, CO" },
        { name: "Exploria Stadium", city: "Orlando, Florida" },
        { name: "Allianz Field", city: "Minnesota" },
      ]);
    });

    it("should parse competition name", async () => {
      server.mockAll("scheduleWithDifferentCompetitions.json");
      const { games } = await getSchedule();
      const competitions = games.map((g) => g.competition);
      expect(competitions).toEqual([
        "Concacaf Champions League",
        "MLS Regular Season",
        "US Open Cup",
        "Canadian Championship",
        "Campeones Cup",
      ]);
    });

    it("should parse teams in and not in the standings", async () => {
      server.mockAll("scheduleWithMlsVsNonMls.json");
      const { games } = await getSchedule();
      const game = games[0];
      const cin: Team = {
        id: 11504,
        abbreviation: "CIN",
        fullName: "FC Cincinnati",
        powerRank: 18,
        record: {
          conference: "East",
          conferenceRank: 9,
          losses: 8,
          ties: 10,
          wins: 8,
        },
        shortName: "Cincinnati",
        sport: "soccer",
      };
      const pit: Team = {
        id: 9908,
        abbreviation: "PIT",
        fullName: "Pittsburgh Riverhounds SC",
        shortName: "Pittsburgh",
        sport: "soccer",
      };
      expect(game.home).toEqual(cin);
      expect(game.away).toEqual(pit);
    });

    it("should parse game time", async () => {
      server.mockAll("scheduleWithGameOnApr19.json");
      const { games } = await getSchedule();
      const { gameTime } = games[0];
      expect(gameTime).toEqual(new Date("2022-04-19T23:00:00.0000000Z"));
    });
  });

  describe("Schedule#teams", () => {
    it("should parse teams", async () => {
      server.mockAll("scheduleWithRepeatTeams.json");
      const { teams } = await getSchedule();
      const names = teams.map((t) => t.shortName);
      expect(names).toEqual(["Santos", "New York City"]);
    });
  });

  describe("Schedule#gamesByDate", () => {
    it("should sort games by Date", async () => {
      server.mockAll("scheduleFromApr19ToApr20.json");
      const { gamesByDate } = await getSchedule();
      const apr19games = gamesByDate["2022-04-19T00:00:00.000-04:00"];
      const apr19Ids = apr19games.map((g) => g.id);
      expect(apr19Ids).toEqual([
        "2022-04-19.pittsburgh-cincinnati.us-open-cup",
      ]);

      const apr20games = gamesByDate["2022-04-20T00:00:00.000-04:00"];
      const apr20Ids = apr20games.map((g) => g.id);
      expect(apr20Ids).toEqual([
        "2022-04-20.fc-motown-rny-fc.us-open-cup",
        "2022-04-20.charlotte-greenville.us-open-cup",
      ]);
    });
  });
});
