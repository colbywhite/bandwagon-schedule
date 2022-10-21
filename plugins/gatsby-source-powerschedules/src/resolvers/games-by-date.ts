import {Types} from '../source-nodes';
import type {GatsbyIterable} from 'gatsby/dist/datastore/common/iterable';
import {DateTime} from 'luxon';
import type {Context} from './index';

type GamesOnDate = { date: string, games: Queries.Game[], totalCount: number }

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

export const gamesByDateResolver = {
  type: [Types.GamesOnDate],
  resolve: async (_: unknown, args: Queries.Query_allGameArgs, {nodeModel}: Context, __: unknown) => {
    const {entries} = await nodeModel.findAll<Queries.Game, Queries.Query_allGameArgs>({
      type: Types.Game,
      query: {...args}
    });
    return groupByDate(entries);
  }
};
