import type {DateTime} from 'luxon';
import React from 'react';

import GameCard from './gameCard';

interface GamesProps {
  games: Queries.Game[];
}

interface DayProps {
  date: DateTime;
}

export default function SingleDaySchedule({
                                            date,
                                            games
                                          }: DayProps & GamesProps) {
  return (
    <section className="flex flex-col gap-3" data-testid="SingleDaySchedule">
      <h4>{date.toFormat('cccc, LLL d')}</h4>
      <div className="grid grid-cols-1 justify-between gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {games.map((game) => (
          <GameCard game={game} key={game.id}/>
        ))}
      </div>
    </section>
  );
}
