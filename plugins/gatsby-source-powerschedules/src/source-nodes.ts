import type {GatsbyNode} from 'gatsby';
import {getTimer} from './reporter-utils';
import {DateTime} from 'luxon';
import type {Game} from '../../../@types';
import getSoccerSchedule from '../lib/ingest/soccer';

export enum Types {
  Game = 'Game',
  Team = 'Team',
  GamesOnDate = 'GamesOnDate'
}

const GAME_TYPE = 'Game';
const TEAM_TYPE = 'Team';

async function getGames(): Promise<Game[]> {
  const startOfDay = DateTime.now().setZone('America/New_York').startOf('day');
  const {games} = await getSoccerSchedule(startOfDay, startOfDay.plus({week: 1}));
  return games;
}

export const getGameNodes: GatsbyNode['sourceNodes'] = async ({
                                                                actions: {createNode},
                                                                createContentDigest,
                                                                createNodeId,
                                                                reporter
                                                              }) => {
  const timer = getTimer(reporter, 'getGames');
  const games = await getGames();
  await Promise.all(games.map(async (game) => {
    const home_id = createNodeId(`${TEAM_TYPE}-${game.home.id}`);
    const away_id = createNodeId(`${TEAM_TYPE}-${game.away.id}`);
    await createNode({
      ...game.home,
      id: home_id,
      logoUrl: 'https://images.mlssoccer.com/image/upload/t_q-best/v1620997957/assets/logos/ATL-Logo-480px.png',
      internal: {type: TEAM_TYPE, contentDigest: createContentDigest(game.home)}
    });
    await createNode({
      ...game.away,
      id: away_id,
      logoUrl: 'https://images.mlssoccer.com/image/upload/t_q-best/v1620997957/assets/logos/ATL-Logo-480px.png',
      internal: {type: TEAM_TYPE, contentDigest: createContentDigest(game.away)}
    });
    return createNode({
      ...game,
      home_id: home_id,
      away_id: away_id,
      home: undefined,
      away: undefined,
      gameTime: game.gameTime.toISOString(),
      id: createNodeId(`${GAME_TYPE}-${game.id}`),
      internal: {type: GAME_TYPE, contentDigest: createContentDigest(game)}
    });
  }));

  timer.end();
  return;
};
