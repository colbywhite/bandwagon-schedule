import path from "path";
import { describe, expect, it, vi } from "vitest";
import {
  BASKETBALL_URLS,
  FixtureHelper,
  jsonResponse,
  mockResponsesBeforeEach,
  textResponse,
} from "../../test.utils";
import { saveGames } from "~/lib/ingest/basketball/index";

// Auto set a wide time frame since that's not what we're testing here
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

  describe("saveGames", () => {
    it("should parse and save games", async () => {
      vi.setSystemTime(new Date(2022, 10, 14));
      server.use(
        jsonResponse(
          BASKETBALL_URLS.schedule,
          fixtures.json("scheduleWithGameOnNov15.json")
        )
      );
      const expectedGame = {
        id: "1654046",
        competition: "NBA",
        home: {
          id: 134878,
          abbreviation: "NOP",
          shortName: "Pelicans",
          fullName: "New Orleans Pelicans",
          powerRank: 9,
          sport: "basketball",
          logoUrl:
            "https://cdn.nba.com/logos/nba/1610612740/primary/L/logo.svg",
        },
        away: {
          id: 134877,
          abbreviation: "MEM",
          shortName: "Grizzlies",
          fullName: "Memphis Grizzlies",
          powerRank: 7,
          sport: "basketball",
          logoUrl:
            "https://cdn.nba.com/logos/nba/1610612763/primary/L/logo.svg",
        },
        venue: { name: "TODO", city: "TODO" },
        gameTime: new Date("2022-11-16T00:30:00.000Z"),
      };
      await saveGames();
      await expectSave("nba-games-2022-11-14", [expectedGame]);
    });
  });
});

// TODO make custom matcher
async function expectSave(name: string, data: any) {
  const supabase = (await import("@supabase/supabase-js")) as any;
  const client = supabase.createClient.results[0][1];
  const bucket = client.storage.from.results[0][1];
  expect(bucket.upload).toHaveBeenCalledWith(name, JSON.stringify(data), {
    contentType: "application/json",
    upsert: true,
  });
}
