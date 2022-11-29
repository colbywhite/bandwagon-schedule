import path from "path";
import { describe, expect, it } from "vitest";

import { DateTime } from "luxon";
import type { Game, Team } from "~/@types";
import { Sport } from "~/@types";

import getOriginalSchedule from "./";
import {
  FixtureHelper,
  jsonResponse,
  mockResponsesBeforeEach,
  SOCCER_URLS,
  textResponse,
} from "../../test.utils";

const gamesToIds = (games: Game[]) => games.map((g) => g.id);
// Auto set a wide time frame since that's not what we're testing here
const getSchedule = getOriginalSchedule.bind(
  null,
  DateTime.fromISO("2000-01-01"),
  DateTime.fromISO("2100-01-01")
);

const fixtures = new FixtureHelper(path.join(__dirname, "fixtures"));
const defaultRankingsResponse = () =>
  textResponse(SOCCER_URLS.rankings, fixtures.text("defaultRankings.html"));
const defaultStandingsResponse = () =>
  jsonResponse(SOCCER_URLS.standings, fixtures.json("defaultStanding.json"));

describe("ingest/soccer", () => {
  describe("Schedule#games", () => {
    const server = mockResponsesBeforeEach(
      defaultRankingsResponse(),
      defaultStandingsResponse()
    );
    it("should parse english, national tv networks", async () => {
      server.use(
        jsonResponse(
          SOCCER_URLS.schedule,
          fixtures.json("scheduleWithDifferentNetworks.json")
        )
      );
      const games = await getSchedule();
      const [nationallyTelevisedGame, locallyTelevisedGame] = games;
      expect(nationallyTelevisedGame.network).toEqual("FS1");
      expect(locallyTelevisedGame.network).toBeUndefined();
    });

    it("should parse venue cities", async () => {
      server.use(
        jsonResponse(
          SOCCER_URLS.schedule,
          fixtures.json("scheduleWithDifferentLocations.json")
        )
      );
      const games = await getSchedule();
      const locations = games.map((g) => g.venue);
      expect(locations).toEqual([
        { name: "Estadio Nacional de Costa Rica", city: "San Jose" },
        { name: "Dick's Sporting Goods Park", city: "Commerce City, CO" },
        { name: "Exploria Stadium", city: "Orlando, Florida" },
        { name: "Allianz Field", city: "Minnesota" },
      ]);
    });

    it("should parse competition name", async () => {
      server.use(
        jsonResponse(
          SOCCER_URLS.schedule,
          fixtures.json("scheduleWithDifferentCompetitions.json")
        )
      );
      const games = await getSchedule();
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
      server.use(
        jsonResponse(
          SOCCER_URLS.schedule,
          fixtures.json("scheduleWithMlsVsNonMls.json")
        )
      );
      const [game] = await getSchedule();
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
        logoUrl:
          "https://images.mlssoccer.com/image/upload/{formatInstructions}/v1620997960/assets/logos/CIN-Logo-480px.png",
        shortName: "Cincinnati",
        sport: Sport.SOCCER,
      };
      const pit: Team = {
        id: 9908,
        abbreviation: "PIT",
        fullName: "Pittsburgh Riverhounds SC",
        shortName: "Pittsburgh",
        logoUrl:
          "https://images.mlssoccer.com/image/upload/{formatInstructions}/v1649645275/assets/competitions/united-soccer-league/pittsburgh-riverhounds-sc-480.png",
        sport: Sport.SOCCER,
      };
      expect(game.home).toEqual(cin);
      expect(game.away).toEqual(pit);
    });

    it("should parse game time", async () => {
      server.use(
        jsonResponse(
          SOCCER_URLS.schedule,
          fixtures.json("scheduleWithGameOnApr19.json")
        )
      );
      const [game] = await getSchedule();
      expect(game.gameTime).toEqual(new Date("2022-04-19T23:00:00.0000000Z"));
    });
  });
});
