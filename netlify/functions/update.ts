import type { Handler } from "@netlify/functions";
import { schedule } from "@netlify/functions";
import getBasketballGames from '~/lib/ingest/basketball'

const update: Handler = async (event, context) => {
  const games = await getBasketballGames()
  console.log(games.length, 'games');
  return { statusCode: 200 };
};

export const handler = schedule("*/10 * * * *", update);
