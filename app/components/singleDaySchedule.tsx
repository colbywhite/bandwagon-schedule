import type { Game } from "~/@types";
import GameCard from "./gameCard";
import Time from "~/components/time";

export default function SingleDaySchedule({
  date,
  games,
}: {
  date: Date | string;
  games: Game[];
}) {
  return (
    <section className="single-day-card">
      <h1 className="card-title">
        <Time time={date} formatter="cccc, LLL d" zone="America/New_York" />
      </h1>
      <div className="card-body">
        {games.map((game) => (
          <GameCard game={game} key={game.id} />
        ))}
      </div>
    </section>
  );
}
