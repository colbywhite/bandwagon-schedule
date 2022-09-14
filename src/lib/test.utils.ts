import fs from 'fs';
import path from 'path';

import type {DefaultBodyType, Path, ResponseTransformer, RestContext} from 'msw';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import type {JSONValue} from 'superjson/src/types';

type Body = Parameters<RestContext['body']>[0];

function restWithBody(url: Path, body: Body) {
  return restWith(url, (ctx) => ctx.body(body));
}

function restWithJson(url: Path, json: JSONValue) {
  return restWith(url, (ctx) => ctx.json(json));
}

function restWith<T extends DefaultBodyType>(
  url: Path,
  contextHandler: (ctx: RestContext) => ResponseTransformer<T>
) {
  return rest.get(url, async (_, res, ctx) => res(contextHandler(ctx)));
}

class MockHelper {
  public constructor(
    private dir: string,
    private server: ReturnType<typeof setupServer>
  ) {
  }

  public mockAll(
    scheduleFixture: string,
    rankingsFixture = 'defaultRankings.html',
    standingsFixture = 'defaultStanding.json'
  ) {
    this.mockSchedule(scheduleFixture);
    this.mockRankings(rankingsFixture);
    this.mockStandings(standingsFixture);
  }

  public mockStandings(standingsFixture: string) {
    this.server.use(
      restWithJson(
        'https://sportapi.mlssoccer.com/api/standings/live',
        this.readJsonFixture(standingsFixture)
      )
    );
  }

  public mockRankings(rankingsFixture: string) {
    this.server.use(
      restWithBody(
        'http://www.powerrankingsguru.com/soccer/mls/team-power-rankings.php',
        this.readTextFixture(rankingsFixture)
      )
    );
  }

  public mockSchedule(scheduleFixture: string) {
    this.server.use(
      restWithJson(
        'https://sportapi.mlssoccer.com/api/matches',
        this.readJsonFixture(scheduleFixture)
      )
    );
  }

  public readJsonFixture(name: string): JSONValue {
    return JSON.parse(this.readTextFixture(name).toString());
  }

  public readTextFixture(name: string): Buffer {
    return fs.readFileSync(path.join(this.dir, name));
  }
}

export function setupTestsWithMockHelper(fixtureDir: string) {
  const server = setupServer();
  beforeAll(() => server.listen({onUnhandledRequest: 'error'}));

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());
  return new MockHelper(fixtureDir, server);
}
