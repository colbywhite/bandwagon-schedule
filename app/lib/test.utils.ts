import fs from "fs";
import type { RestHandler } from "msw";
import { rest } from "msw";
import path from "path";
import { setupServer } from "msw/node";
import { afterEach, beforeAll } from "vitest";

type JSONPrimitive = string | number | boolean;
type JSONValue =
  | JSONPrimitive
  | JSONPrimitive[]
  | Record<string, JSONPrimitive>;

export class FixtureHelper {
  public constructor(private dir: string) {}

  public json<T extends JSONValue>(name: string): T {
    return JSON.parse(this.text(name).toString());
  }

  public text(name: string): Buffer {
    return fs.readFileSync(path.join(this.dir, name));
  }
}

export function jsonResponse(url: string, json: JSONValue) {
  return rest.get(url, (req, res, ctx) => res(ctx.status(200), ctx.json(json)));
}

export function textResponse(
  url: string,
  body: string | Blob | BufferSource | FormData | ReadableStream<any>
) {
  return rest.get(url, (req, res, ctx) => res(ctx.status(200), ctx.body(body)));
}

export function mockResponsesBeforeEach(...handlers: RestHandler[]) {
  const server = setupServer(...handlers);
  const closeServer = () => {
    server.close();
    // console.info("🔶 Mock server closed.");
  };
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
    process.once("SIGINT", closeServer);
    process.once("SIGTERM", closeServer);
    // console.info("🔶 Mock server running.");
    return closeServer;
  });
  afterEach(() => {
    server.resetHandlers();
    // console.info("🔶 Mock server reset.");
  });
  return server;
}

export const BASKETBALL_URLS = {
  rankings: "http://www.powerrankingsguru.com/nba/team-power-rankings.php",
  teams:
    "https://www.thesportsdb.com/api/v1/json/TEST_KEY/lookup_all_teams.php",
  schedule: "https://www.thesportsdb.com/api/v1/json/TEST_KEY/eventsseason.php",
};

export const SOCCER_URLS = {
  rankings:
    "http://www.powerrankingsguru.com/soccer/mls/team-power-rankings.php",
  standings: "https://sportapi.mlssoccer.com/api/standings/live",
  schedule: "https://sportapi.mlssoccer.com/api/matches",
};
