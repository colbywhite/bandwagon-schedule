import type { Handler } from "@netlify/functions";
import { schedule } from "@netlify/functions";
import { saveAllGames } from "~/lib/ingest";

const updateCache: Handler = async (event, context) => {
  const games = await saveAllGames();
  console.log("Saved", games.length, "games");
  return { statusCode: 200 };
};

export const handler = schedule("*/10 * * * *", updateCache);
