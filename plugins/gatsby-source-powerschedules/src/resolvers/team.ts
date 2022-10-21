import {Types} from '../source-nodes';
import type {Context} from './index';

const teamResolver = (key: 'home_id' | 'away_id') => async (source: Queries.Game, args: unknown, {nodeModel}: Context, __: unknown) => {
  return nodeModel.findOne<Queries.Team, Queries.Query_allTeamArgs>({
    type: Types.Team,
    query: {filter: {id: {eq: source[key]}}}
  });
};
export const homeTeamResolver = {
  type: `${Types.Team}!`,
  resolve: teamResolver('home_id')
};
export const awayTeamResolver = {
  type: `${Types.Team}!`,
  resolve: teamResolver('away_id')
};
