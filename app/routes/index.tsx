import type { HeadersFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getAllGames } from "~/lib/ingest";
import { DateTime } from "luxon";
import { useLoaderData } from "@remix-run/react";
import SingleDaySchedule from "~/components/singleDaySchedule";
import Header from "~/components/header";
import { getTimeZone } from "~/utils";
import { collectCommonTeams, groupGamesByDate } from "~/lib/ingest";

export async function loader({ request, context: { clientIp } }: LoaderArgs) {
  const [games, zone] = await Promise.all([
    getAllGames(),
    getTimeZone(clientIp),
  ]);
  const teams = collectCommonTeams(games);
  const gamesByDate = groupGamesByDate(games);
  const logos = teams.filter((t) => t.logoUrl).map((t) => t.logoUrl);
  const headers = new Headers({ "x-logos": JSON.stringify(logos) });
  return json({ zone, gamesByDate }, { headers });
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const logoHeaderValue = loaderHeaders.get("x-logos");
  if (logoHeaderValue) {
    const logos = JSON.parse(logoHeaderValue) as string[];
    const linkValue = logos.map((l) => `<${l}>; rel=prefetch`).join(", ");
    return new Headers({ Link: linkValue });
  }
  return new Headers();
};

export default function Index() {
  const { gamesByDate, zone } = useLoaderData<typeof loader>();
  return (
    <div className="flex w-full flex-col justify-around gap-1.5 p-2 focus-visible:outline-none md:p-3 lg:p-4">
      <Header />
      <main className="motion-safe:animate-fade-in my-3 flex flex-col gap-2">
        {Object.keys(gamesByDate)
          .map((date) => ({ date, games: gamesByDate[date] }))
          .map(({ date, games }) => (
            <SingleDaySchedule
              date={DateTime.fromISO(date).setZone(zone)}
              games={games}
              key={date}
            />
          ))}
      </main>
    </div>
  );
}
