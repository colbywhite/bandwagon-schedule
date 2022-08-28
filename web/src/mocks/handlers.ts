import { rest } from "msw";
import superjson from "superjson";
import type { Game, Schedule } from "types/index";
import { BuiltSchedule } from "src/functions/schedule/schedule";

export default rest.get(
  "/.redwood/functions/schedule",
  async (req, res, ctx) => {
    const game: Game = {
      id: "2022-08-27.houston-minnesota.regular-season",
      competition: "MLS Regular Season",
      home: {
        id: 6977,
        abbreviation: "MIN",
        shortName: "Minnesota",
        fullName: "Minnesota United",
        powerRank: 7,
        sport: "soccer",
        record: {
          wins: 12,
          losses: 9,
          ties: 5,
          conference: "West",
          conferenceRank: 3,
        },
      },
      away: {
        id: 1897,
        abbreviation: "HOU",
        shortName: "Houston",
        fullName: "Houston Dynamo FC",
        powerRank: 27,
        sport: "soccer",
        record: {
          wins: 7,
          losses: 14,
          ties: 5,
          conference: "West",
          conferenceRank: 12,
        },
      },
      venue: {
        name: "Allianz Field",
        city: "Minnesota",
      },
      network: "Univision",
      gameTime: new Date("2022-08-27T19:30:00.000Z"),
    };
    const schedule: Schedule = {
      games: [game],
      teams: [game.home, game.away],
      gamesByTeam: {
        [game.home.shortName]: [game],
        [game.away.shortName]: [game],
      },
      gamesByDate: {
        "2022-08-27T00:00:00.000Z": [game],
      },
    };
    const response: BuiltSchedule = {
      buildTime: new Date(),
      schedule: schedule,
    };
    return res(ctx.body(superjson.stringify(response)));
  }
);
