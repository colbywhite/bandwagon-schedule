import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import getSoccerGames from "~/lib/ingest/soccer";
import { DateTime } from "luxon";
import { useLoaderData } from "@remix-run/react";
import SingleDaySchedule from "~/components/singleDaySchedule";
import Header from "~/components/header";
import { getTimeZone } from "~/utils";

export async function loader({ request, context: { clientIp } }: LoaderArgs) {
  // TODO: hardcode dates for now since mls season is over.
  const min = DateTime.fromISO("2022-10-01");
  const max = DateTime.fromISO("2022-10-14");
  const [{ gamesByDate }, zone] = await Promise.all([
    getSoccerGames(min, max),
    getTimeZone(clientIp),
  ]);
  return json({ zone, gamesByDate });
}

export default function Index() {
  const { gamesByDate, zone } = useLoaderData<typeof loader>();
  return (
    <div className="flex w-full flex-col justify-around gap-1.5 p-2 focus-visible:outline-none md:p-3 lg:p-4">
      <Header />
      <main className="motion-safe:animate-fade-in my-3 flex flex-col gap-2">
        <h1>Zone: {JSON.stringify(zone)}</h1>
        {Object.keys(gamesByDate)
          .map((date) => ({ date, games: gamesByDate[date] }))
          .map(({ date, games }) => (
            <SingleDaySchedule
              date={DateTime.fromISO(date).setZone("America/New_York")}
              games={games}
              key={date}
            />
          ))}
      </main>
    </div>
  );
}
