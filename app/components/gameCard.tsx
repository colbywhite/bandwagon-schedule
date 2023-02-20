import type { DateFormatter } from "./time";
import Time from "./time";
import type { Game } from "~/@types";
import { TeamCard } from "~/components/teamCard";

const gameTimeFormatter: DateFormatter = (date, zone: string) => {
  const dateTime = date.setZone(zone);
  const timeZone = dateTime.toFormat("ZZZZZ").split(" ")[0];
  return dateTime.toFormat(`h:mm a '${timeZone}'`);
};

export default function GameCard({ game }: { game: Game }) {
  return (
    <section className="game-card">
      <h2 className="card-title">{game.competition}</h2>
      <div className="card-body">
        <TeamCard team={game.away} />
        <TeamCard team={game.home} />
      </div>
      <div className="card-footer">
        <Time time={game.gameTime} formatter={gameTimeFormatter}></Time>
        <p>
          {game.venue.name}, {game.venue.city}
        </p>
      </div>
    </section>
  );
}
