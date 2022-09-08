import { DateTime } from "luxon";
import type { Game as GraphQLGame, GetSchedule } from "types/graphql";
import type { Game } from "types/index";

import type { CellFailureProps, CellSuccessProps } from "@redwoodjs/web";

import SingleDaySchedule from "src/components/singleDaySchedule";

export const QUERY = gql`
  query GetSchedule {
    getSchedule {
      buildDate
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
            sport
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
            sport
          }
          network
          gameTime
          competition
          venue {
            name
            city
          }
        }
      }
    }
  }
`;

export const Loading = () => <p className="text-center">Loading..</p>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: "red" }}>Error: {error?.message}</div>
);

function parseGame(game: GraphQLGame): Game {
  return { ...game, gameTime: new Date(game.gameTime) };
}

export const Success = ({
  getSchedule: { buildDate, gamesByDate },
}: CellSuccessProps<GetSchedule>) => (
  <>
    <p>{buildDate}</p>
    {gamesByDate.map(({ date, games }) => {
      const parsedDate = DateTime.fromISO(date).setZone("America/New_York");
      return (
        <SingleDaySchedule
          date={parsedDate}
          games={games.map(parseGame)}
          key={parsedDate.toISODate()}
        />
      );
    })}
  </>
);
