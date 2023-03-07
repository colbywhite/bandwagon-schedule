import type { HeadersFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { collectCommonTeams, getAllGames, groupGamesByDate } from "~/lib/ingest";
import { useLoaderData } from "@remix-run/react";
import SingleDaySchedule from "~/components/singleDaySchedule";

export async function loader({ request }: LoaderArgs) {
  const games = await getAllGames();
  const teams = collectCommonTeams(games);
  const gamesByDate = groupGamesByDate(games);
  const logos = teams.filter((t) => t.logoUrl).map((t) => t.logoUrl);
  const headers = new Headers({ "x-logos": JSON.stringify(logos) });
  return json({ gamesByDate }, { headers });
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const logoHeaderValue = loaderHeaders.get("x-logos");
  const cacheInit: HeadersInit = {
    "Cache-Control": "max-age=100",
  };
  if (logoHeaderValue) {
    const logos = JSON.parse(logoHeaderValue) as string[];
    const linkValue = logos.map((l) => `<${l}>; rel=prefetch`).join(", ");
    return new Headers({ ...cacheInit, Link: linkValue });
  }
  return new Headers(cacheInit);
};

export default function Index() {
  const { gamesByDate } = useLoaderData<typeof loader>();
  return (
    <main className="motion-safe:animate-fade-in my-3 flex flex-col gap-2">
      {Object.keys(gamesByDate)
        .map((date) => ({ date, games: gamesByDate[date] }))
        .map(({ date, games }) => (
          <SingleDaySchedule date={date} games={games} key={date} />
        ))}
    </main>
  );
}
