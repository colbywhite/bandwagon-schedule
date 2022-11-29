import type { DateTime } from "luxon";
import React from "react";
import type { Game } from "~/@types";

import GameCard from "./gameCard";
import type { SerializeFrom } from "@remix-run/server-runtime";
import Time from "~/components/time";

interface GamesProps {
  games: Array<Game | SerializeFrom<Game>>;
}

interface DayProps {
  date: DateTime;
}

export default function SingleDaySchedule({
  date,
  games,
}: DayProps & GamesProps) {
  return (
    <section className="flex flex-col gap-3" data-testid="SingleDaySchedule">
      <h4>
        <Time
          time={date}
          formatter="cccc, LLL d"
          zone="America/New_York"
        ></Time>
      </h4>
      <div className="grid grid-cols-1 justify-between gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {games.map((game) => (
          <GameCard game={game} key={game.id} />
        ))}
      </div>
    </section>
  );
}
