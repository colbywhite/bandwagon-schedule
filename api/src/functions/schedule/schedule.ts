import type { APIGatewayEvent, Context } from "aws-lambda";
import { DateTime } from "luxon";
import superjson from "superjson";
import type { Schedule } from "types/index";

import getSoccerSchedule from "src/lib/ingest/soccer";

interface BuildInfo {
  buildTime: Date;
}

export type BuiltSchedule = BuildInfo & { schedule: Schedule };

// TODO in need of a cache proxy in front of the third-party endpoints
export const handler = async (_: APIGatewayEvent, __: Context) => {
  const startOfDay = DateTime.now().setZone("America/New_York").startOf("day");
  const body: BuiltSchedule = {
    buildTime: new Date(),
    schedule: await getSoccerSchedule(startOfDay, startOfDay.plus({ week: 1 })),
  };
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: superjson.stringify(body),
  };
};
