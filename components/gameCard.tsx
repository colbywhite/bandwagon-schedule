import Typography from '@mui/material/Typography';
import type {Game, Team, TeamRecord} from '../pages/lib/types';
import {DateTime} from 'luxon';

interface GameProps {
  game: Game;
}

interface TeamProps {
  team: Team;
}

function formatTime(date: Date) {
  const dateTime = DateTime.fromJSDate(date);
  const timeZone = dateTime.toFormat('ZZZZZ').split(' ')[0];
  return dateTime.toFormat(`h:mm a '${timeZone}'`);
}

function TeamInfo({team}: TeamProps) {
  const recordToString = (record: TeamRecord) => record.ties
    ? `${record.wins}-${record.losses}-${record.ties}`
    : `${record.wins}-${record.losses}`;
  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="h-[50px] w-[50px]">
        <img src={`/basketball-logos/${team.abbreviation.toLowerCase()}.png`}
             alt={team.shortName} width="50" height="50"/>
      </div>
      <div className="flex flex-col gap-0">
        <Typography className="mb-1" variant="h5" component="p">{team.shortName}</Typography>
        <Typography variant="caption" component="p">
          {recordToString(team.record)}, {team.record.conferenceRank} in {team.record.conference}
        </Typography>
        <Typography variant="caption" component="p">Power Rank: {team.powerRank}</Typography>
      </div>
    </div>
  );
}

export default function GameCard({game}: GameProps) {
  return (
    <div className="border-2 border-400 p-1 flex flex-row gap-1 justify-around items-center">
      <div className="flex flex-col gap-1 grow border-r-2 border-r-400">
        <TeamInfo team={game.away}/>
        <TeamInfo team={game.home}/>
      </div>
      <div className="flex flex-col basis-1/4 gap-1 items-center text-center">
        <div className="h-fit w-fit max-h-[50px] max-w-[50px]">
          <img src={`/network-logos/${game.network.toLowerCase()}.png`} alt={`${game.network} logo`}/>
        </div>
        <Typography variant="caption">{formatTime(game.gameTime)}</Typography>
      </div>
    </div>
  );
}
