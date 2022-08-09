import Typography from '@mui/material/Typography';
import type {DateTime} from 'luxon';
import type {Game} from '../lib/types';
import GameCard from './gameCard';

interface GamesProps {
  games: Game[];
}

interface DayProps {
  date: DateTime;
}

export default function SingleDaySchedule({date, games}: DayProps & GamesProps) {
  return (
    <section className="flex flex-col gap-3">
      <Typography variant="h4">{date.toFormat('cccc, LLL d')}</Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-between">
        {games.map(game => (<GameCard game={game} key={game.id}/>))}
      </div>
    </section>
  );
}
