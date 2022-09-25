import type {GatsbyNode} from 'gatsby';
import {DateTime} from 'luxon';
import type {Game} from '../../@types';
import getSoccerSchedule from './lib/ingest/soccer';
import type {GatsbyIterable} from 'gatsby/dist/datastore/common/iterable';

export const onPreInit: GatsbyNode['onPreInit'] = ({reporter: {success}}) => success('gatsby-powerschedules-plugin loaded');

async function getGames(): Promise<Game[]> {
  const startOfDay = DateTime.now().setZone('America/New_York').startOf('day');
  const {games} = await getSoccerSchedule(startOfDay, startOfDay.plus({week: 1}));
  return games;
}

type GamesOnDate = { date: string, games: Queries.Game[], totalCount: number }
const GAMES_ON_DATE_TYPE = 'GamesOnDate';

function groupByDate(nodes: GatsbyIterable<Queries.Game>): GamesOnDate[] {
  let result: GamesOnDate[] = [];
  nodes.forEach(node => {
    const date = DateTime.fromISO(node.gameTime)
      .setZone('America/New_York')
      .startOf('day')
      .toISO();
    const existingGamesOnDateIndex = result.findIndex(i => i.date === date);
    if (existingGamesOnDateIndex === -1) {
      result = [...result, {date: date, games: [node], totalCount: 1}];
    } else {
      const {games} = result[existingGamesOnDateIndex];
      result[existingGamesOnDateIndex] = {
        date: date,
        games: [...games, node],
        totalCount: games.length + 1
      };
    }
  });
  return result;
}

const GAME_TYPE = 'Game';
const sourceNodesActivityName = 'powerschedules.getGames';

enum STATUSES {
  InProgress = 'Fetching games',
  Done = 'Fetched games'
}

export const sourceNodes: GatsbyNode['sourceNodes'] = async ({
                                                               actions: {createNode},
                                                               createContentDigest,
                                                               createNodeId,
                                                               reporter
                                                             }) => {
  const activity = reporter.activityTimer(sourceNodesActivityName);
  activity.start();
  activity.setStatus(STATUSES.InProgress);

  const games = await getGames();
  await Promise.all(games.map(game => createNode({
    ...game,
    gameTime: game.gameTime.toISOString(),
    id: createNodeId(`${GAME_TYPE}-${game.id}`),
    internal: {type: GAME_TYPE, contentDigest: createContentDigest(game)}
  })));

  activity.setStatus(STATUSES.Done);
  activity.end();
  return;
};

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({actions: {createTypes}}) => {
  const typeDefs = `
    enum Sport {
      soccer
    }
    type TeamRecord {
      wins: Int!
      losses: Int!
      ties: Int
      conference: String!
      conferenceRank: Int!
    }
    type Team {
      id: Int!
      shortName: String!
      fullName: String!
      abbreviation: String!
      record: TeamRecord
      powerRank: Int
      sport: Sport!
    }
    type Venue {
      name: String!
      city: String!
    }
    type Game implements Node {
      id: String!
      home: Team!
      away: Team!
      network: String
      gameTime: Date!
      competition: String!
      venue: Venue!
    }
    type GamesOnDate {
      date: Date!
      games: [Game!]!
      totalCount: Int!
    }
    type Query {
      gamesByDate(
        filter: GameFilterInput
        limit: Int
        skip: Int
        sort: GameSortInput
      ): [GamesOnDate!]!
    }
`;
  createTypes(typeDefs);
};

type NodeModel = { findAll: <ReturnNode, QueryArgs>(args: { query: QueryArgs, type: string }) => Promise<{ entries: GatsbyIterable<ReturnNode>, totalCount: () => Promise<number> }> }
type Context = { nodeModel: NodeModel }
export const createResolvers: GatsbyNode['createResolvers'] = ({createResolvers}) => {
  const resolvers = {
    Query: {
      gamesByDate: {
        type: [GAMES_ON_DATE_TYPE],
        resolve: async (_: unknown, args: Queries.Query_allGameArgs, {nodeModel}: Context, __: unknown) => {
          const {entries} = await nodeModel.findAll<Queries.Game, Queries.Query_allGameArgs>({
            type: GAME_TYPE,
            query: {...args}
          });
          return groupByDate(entries);
        }
      }
    }
  };
  createResolvers(resolvers);
};
