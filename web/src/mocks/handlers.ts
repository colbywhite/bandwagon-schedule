import { DateTime } from "luxon";
import { rest } from "msw";
import superjson from "superjson";
import type { Schedule } from "types/index";
import { Game } from "types/index";

const augSeventh: DateTime = DateTime.fromISO("2022-08-07T19:00:00", {
  zone: "America/New_York",
});
export default rest.get(
  "/.redwood/functions/schedule",
  async (req, res, ctx) => {
    const schedule: Record<string, Game[]> = {
      [augSeventh.toISODate()]: [
        {
          id: 0,
          away: {
            shortName: "Hawks",
            fullName: "Atlanta Hawks",
            abbreviation: "ATL",
            record: {
              wins: 111,
              losses: 100,
              ties: 100,
              conference: "East",
              conferenceRank: 100,
            },
            powerRank: 100,
            sport: "soccer",
          },
          home: {
            shortName: "Hawks",
            fullName: "Atlanta Hawks",
            abbreviation: "ATL",
            record: {
              wins: 111,
              losses: 100,
              ties: 100,
              conference: "East",
              conferenceRank: 100,
            },
            powerRank: 100,
            sport: "soccer",
          },
          network: "ABC",
          gameTime: augSeventh.toJSDate(),
          competition: "NBA Regular Season",
          venue: {
            name: "Madison Square Garden",
            city: "New York, NY",
          },
        },
      ],
    };
    return res(ctx.body(superjson.stringify(schedule)));
  }
);
