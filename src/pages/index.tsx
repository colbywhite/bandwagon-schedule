import React from 'react';
import Header from '../components/header';
import type {HeadFC} from 'gatsby';
import {graphql} from 'gatsby';
import type {Game} from '../../@types';
import GameCard from '../components/gameCard';

export const ALL_GAMES_QUERY = graphql`
query AllGamesQuery {
  allGame {
    totalCount
    nodes {
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

type RawGame = Omit<Game, 'gameTime'> & {gameTime: string}
export default function Index({data}: { data: { allGame: { nodes: RawGame[] } } }) {
  return (
    <div className="flex w-full flex-col justify-around gap-1.5 p-2 focus-visible:outline-none md:p-3 lg:p-4">
      <Header/>
      <main className="my-3 flex flex-col gap-2">
        {data.allGame.nodes.map((game: RawGame) => (
          <GameCard key={game.id} game={{...game, gameTime: new Date(game.gameTime)}}/>))}
      </main>
    </div>
  );
}

export const Head: HeadFC = () => <title>Power schedules</title>;
