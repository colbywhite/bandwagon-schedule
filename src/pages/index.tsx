import React from 'react';
import Header from '../components/header';
import type {HeadFC} from 'gatsby';
import {graphql} from 'gatsby';
import {DateTime} from 'luxon';
import SingleDaySchedule from '../components/singleDaySchedule';
import useRenderer, {Renderer} from '../components/renderer';

export const UPCOMING_GAMES_QUERY = graphql`
query UpcomingGamesQuery {
  gamesByDate {
    date
    games {
      id
      home {
        id
        shortName
        fullName
        abbreviation
        record {
          wins
          losses
          ties
          conference
          conferenceRank
        }
        powerRank
      }
      away {
        id
        shortName
        fullName
        abbreviation
        record {
          wins
          losses
          ties
          conference
          conferenceRank
        }
        powerRank
      }
      gameTime
      competition
      venue {
        name
        city
      }
    }
  }
}
`;

export default function Index({data}: { data: Queries.UpcomingGamesQueryQuery }) {
  const {renderer} = useRenderer()
  return (
    <div className="flex w-full flex-col justify-around gap-1.5 p-2 focus-visible:outline-none md:p-3 lg:p-4">
      <Header/>
      <main className="my-3 flex flex-col gap-2 motion-safe:animate-fade-in">
        {renderer==Renderer.CLIENT && data.gamesByDate &&
          data.gamesByDate.map((gamesOnDate) =>
            (gamesOnDate && <SingleDaySchedule
              date={DateTime.fromISO(gamesOnDate.date).setZone('America/New_York')}
              games={gamesOnDate.games as Queries.Game[]}
              key={gamesOnDate.date}
            />)
          )}
      </main>
    </div>
  );
}

export const Head: HeadFC = () => <title>Power schedules</title>;
