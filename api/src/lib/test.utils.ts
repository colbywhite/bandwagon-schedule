import type { Path, ResponseTransformer, RestContext } from "msw";
import { rest } from "msw";

import { setupServer } from "msw/node";
import type { JSONValue } from "superjson/src/types";
import path from "path";
import type { PathOrFileDescriptor } from "fs";
import fs from "fs";

type Body = Parameters<RestContext["body"]>[0];

export function restWithBody(url: Path, body: Body) {
  return restWith(url, (ctx) => ctx.body(body));
}

export function restWithJson(url: Path, json: JSONValue) {
  return restWith(url, (ctx) => ctx.json(json));
}

function restWith<T>(
  url: Path,
  contextHandler: (ctx: RestContext) => ResponseTransformer<T>
) {
  return rest.get(url, async (_, res, ctx) => res(contextHandler(ctx)));
}

export class FixtureLoader {
  public constructor(private dir: string) {}

  public readJsonData(name: string): JSONValue {
    return JSON.parse(this.readData(name).toString());
  }

  public readData(name: string): Buffer {
    return fs.readFileSync(path.join(this.dir, name));
  }
}

export function setupTestsWithServer() {
  const server = setupServer();
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());
  return server;
}
