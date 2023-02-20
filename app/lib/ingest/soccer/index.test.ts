import path from "path";
import { describe, expect, it, vi } from "vitest";
import {
  FixtureHelper,
  jsonResponse,
  mockResponsesBeforeEach,
  SOCCER_URLS,
  textResponse,
} from "../../test.utils";
import { saveGames } from "~/lib/ingest/soccer/index";

const fixtures = new FixtureHelper(path.join(__dirname, "fixtures"));
const defaultRankingsResponse = () =>
  textResponse(SOCCER_URLS.rankings, fixtures.text("defaultRankings.html"));
const defaultStandingsResponse = () =>
  jsonResponse(SOCCER_URLS.standings, fixtures.json("defaultStanding.json"));

describe("ingest/soccer", () => {
  describe("saveGames", () => {
    const server = mockResponsesBeforeEach(
      defaultRankingsResponse(),
      defaultStandingsResponse()
    );

    it("should parse and save games", async () => {
      vi.setSystemTime(new Date(2022, 3, 18));
      server.use(
        jsonResponse(
          SOCCER_URLS.schedule,
          fixtures.json("scheduleWithGameOnApr19.json")
        )
      );
      const expectedGame = {
        id: "2022-04-19.pittsburgh-cincinnati.us-open-cup",
        competition: "US Open Cup",
        home: {
          id: 11504,
          abbreviation: "CIN",
          shortName: "Cincinnati",
          fullName: "FC Cincinnati",
          powerRank: 18,
          sport: "soccer",
          record: {
            wins: 8,
            losses: 8,
            ties: 10,
            conference: "East",
            conferenceRank: 9,
          },
          logoUrl:
            "https://images.mlssoccer.com/image/upload/{formatInstructions}/v1620997960/assets/logos/CIN-Logo-480px.png",
        },
        away: {
          id: 9908,
          abbreviation: "PIT",
          shortName: "Pittsburgh",
          fullName: "Pittsburgh Riverhounds SC",
          powerRank: undefined,
          sport: "soccer",
          record: undefined,
          logoUrl:
            "https://images.mlssoccer.com/image/upload/{formatInstructions}/v1649645275/assets/competitions/united-soccer-league/pittsburgh-riverhounds-sc-480.png",
        },
        venue: { name: "TQL Stadium", city: "Cincinnati, OH" },
        network: undefined,
        gameTime: new Date("2022-04-19T23:00:00.000Z"),
      };
      await saveGames();
      await expectSave("mls-games-2022-04-18", [expectedGame]);
    });

    it.todo("should exclude irrelevant competitions");
    it.todo("should exclude irrelevant networks");
    it.todo("should include non-MLS teams");
  });
});

// TODO make custom matcher
async function expectSave(name: string, data: any) {
  const supabase = (await import("@supabase/supabase-js")) as any;
  const client = supabase.createClient.results[0][1];
  const bucket = client.storage.from.results[0][1];
  expect(bucket.upload).toHaveBeenCalledWith(
    name,
    JSON.stringify(data), // TODO don't assert strings so order won't matter
    {
      contentType: "application/json",
      upsert: true,
    }
  );
}
