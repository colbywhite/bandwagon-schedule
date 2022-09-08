import { DateTime } from "luxon";
import type { Game, Team, TeamRecord } from "types/index";

interface GameProps {
  game: Game;
}

interface TeamProps {
  team: Team;
}

interface RecordProps {
  record?: TeamRecord;
}

interface RankProps {
  rank?: number;
}

interface NetworkProps {
  network?: string;
}

function formatTime(date: Date) {
  const dateTime = DateTime.fromJSDate(date);
  const timeZone = dateTime.toFormat("ZZZZZ").split(" ")[0];
  return dateTime.toFormat(`h:mm a '${timeZone}'`);
}

function Record({ record }: RecordProps) {
  const recordToString = (record: TeamRecord) =>
    record.ties
      ? `${record.wins}-${record.losses}-${record.ties}`
      : `${record.wins}-${record.losses}`;
  return record ? (
    <p>
      {recordToString(record)}, {record.conferenceRank} in {record.conference}
    </p>
  ) : (
    <></>
  );
}

function Rank({ rank }: RankProps) {
  return rank ? <p>Power Rank: {rank}</p> : <></>;
}

function NetworkLogo({ network }: NetworkProps) {
  return network ? (
    <div className="h-fit max-h-[50px] w-fit max-w-[50px]">
      <img
        src={`/network-logos/${network.toLowerCase()}.png`}
        alt={`${network} logo`}
      />
    </div>
  ) : (
    <></>
  );
}

function TeamInfo({ team }: TeamProps) {
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
        <Record record={team.record}></Record>
        <Rank rank={team.powerRank}></Rank>
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
          <NetworkLogo network={game.network}></NetworkLogo>
          <p>{formatTime(game.gameTime)}</p>
        </div>
      </div>
      <div className="text-center">
        <p>{game.competition}</p>
        <p>
          {game.venue.name}, {game.venue.city}
        </p>
      </div>
    </div>
  );
}
