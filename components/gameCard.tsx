import Typography from '@mui/material/Typography';
import type {Game, Team} from '../pages/lib/types';

interface GameProps {
  game: Game;
}

interface TeamProps {
  team: Team;
}

function TeamInfo({team}: TeamProps) {
  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="h-[50px] w-[50px]">
        <img src={`/basketball-logos/${team.abbreviation.toLowerCase()}.png`}
             alt={team.shortName} width="50" height="50"/>
      </div>
      <div className="flex flex-col gap-1">
        <Typography variant="body1">{team.shortName}</Typography>
        <Typography variant="subtitle2">100-100, 100 in West</Typography>
        <Typography variant="subtitle2">Rank: 100</Typography>
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
        <Typography variant="subtitle2">12:30pm Central</Typography>
      </div>
    </div>
  );
}
