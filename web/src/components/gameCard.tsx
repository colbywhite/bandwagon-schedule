import type { Game, Team, TeamRecord } from "types/index";
import { DateTime } from "luxon";

interface GameProps {
  game: Game;
}

interface TeamProps {
  team: Team;
}

function formatTime(date: Date) {
  const dateTime = DateTime.fromJSDate(date);
  const timeZone = dateTime.toFormat("ZZZZZ").split(" ")[0];
  return dateTime.toFormat(`h:mm a '${timeZone}'`);
}

function TeamInfo({ team }: TeamProps) {
  const recordToString = (record: TeamRecord) =>
    record.ties
      ? `${record.wins}-${record.losses}-${record.ties}`
      : `${record.wins}-${record.losses}`;
  return (
    <div className="flex flex-row items-center gap-4">
      <div className="h-[50px] w-[50px]">
        <img
          src={`/basketball-logos/${team.abbreviation.toLowerCase()}.png`}
          alt={team.shortName}
          width="50"
          height="50"
        />
      </div>
      <div className="flex flex-col gap-0">
        <h5 className="mb-1">{team.shortName}</h5>
        <p>
          {recordToString(team.record)}, {team.record.conferenceRank} in{" "}
          {team.record.conference}
        </p>
        <p>Power Rank: {team.powerRank}</p>
      </div>
    </div>
  );
}

export default function GameCard({ game }: GameProps) {
  return (
    <div className="border-400 flex flex-col gap-3 border-2 p-1">
      <div className="flex flex-row items-center justify-around gap-1">
        <div className="border-r-400 flex grow flex-col gap-1 border-r-2">
          <TeamInfo team={game.away} />
          <TeamInfo team={game.home} />
        </div>
        <div className="flex basis-1/4 flex-col items-center gap-1 text-center">
          <div className="h-fit max-h-[50px] w-fit max-w-[50px]">
            <img
              src={`/network-logos/${game.network.toLowerCase()}.png`}
              alt={`${game.network} logo`}
            />
          </div>
          <p>{formatTime(game.gameTime)}</p>
        </div>
      </div>
      <div className="text-center">
        <p>{game.competitionDescription}</p>
        <p>
          {game.location.arena}, {game.location.city},{" "}
          {game.location.subdivision}
        </p>
      </div>
    </div>
  );
}
