import { json, LoaderArgs } from "@remix-run/node";
import getSoccerGames from "~/lib/ingest/soccer";
import { DateTime } from "luxon";
import { useLoaderData } from "@remix-run/react";
import SingleDaySchedule from "~/components/singleDaySchedule";
import Header from "~/components/header";

export async function loader({request, context}: LoaderArgs) {
  // TODO: hardcode dates for now since mls season is over.
  const min = DateTime.fromISO("2022-10-01");
  const max = DateTime.fromISO("2022-10-14");
  const { gamesByDate } = await getSoccerGames(min, max);
  return json({ headers: request.headers, context: context, gamesByDate });
}

export default function Index() {
  const { gamesByDate, headers, context } = useLoaderData<typeof loader>();
  return (
    <div className="flex w-full flex-col justify-around gap-1.5 p-2 focus-visible:outline-none md:p-3 lg:p-4">
      <Header />
      <main className="motion-safe:animate-fade-in my-3 flex flex-col gap-2">
        <h1>Headers: {JSON.stringify(headers)}</h1>
        <h1>Context: {JSON.stringify(context)}</h1>
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
