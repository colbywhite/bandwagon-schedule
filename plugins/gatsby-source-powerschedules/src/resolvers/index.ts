import type {GatsbyNode} from 'gatsby';
import {awayTeamResolver, homeTeamResolver} from './team';
import {gamesByDateResolver} from './games-by-date';
import {logoResolver} from './logo';

type NodeModel = { findOne: <ReturnNode, QueryArgs>(args: { query: QueryArgs, type: string }) => Promise<{ entries: GatsbyIterable<ReturnNode>, totalCount: () => Promise<number> }>, findAll: <ReturnNode, QueryArgs>(args: { query: QueryArgs, type: string }) => Promise<{ entries: GatsbyIterable<ReturnNode>, totalCount: () => Promise<number> }> }
export type Context = { nodeModel: NodeModel }

export const createScheduleResolvers: GatsbyNode['createResolvers'] = ({createResolvers}) => {
  const resolvers = {
    Query: {
      gamesByDate: gamesByDateResolver,
    },
    Game: {
      home: homeTeamResolver,
      away: awayTeamResolver
    },
    Team: {
      logo: logoResolver
    }
  };
  createResolvers(resolvers);
};
