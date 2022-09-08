import { DateTime } from "luxon";
import type { QueryResolvers } from "types/graphql";

import getSoccerSchedule from "src/lib/ingest/soccer";

export const getSchedule: QueryResolvers["getSchedule"] = async () => {
  const startOfDay = DateTime.now().setZone("America/New_York").startOf("day");
  const { gamesByDate } = await getSoccerSchedule(
    startOfDay,
    startOfDay.plus({ week: 1 })
  );
  // TODO Move this format logic to getSoccerSchedule
  const formattedGamesByDate = Object.keys(gamesByDate).map((date) => ({
    date: date,
    games: gamesByDate[date],
  }));
  return { buildDate: new Date(), gamesByDate: formattedGamesByDate };
};
