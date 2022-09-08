// TODO figure out how to autogenerate these from types/index
export const schema = gql`
  enum Sport {
    soccer
  }

  type TeamRecord {
    wins: Int!
    losses: Int!
    ties: Int
    conference: String!
    conferenceRank: Int!
  }

  type Team {
    id: Int!
    shortName: String!
    fullName: String!
    abbreviation: String!
    record: TeamRecord
    powerRank: Int
    sport: Sport!
  }

  type Venue {
    name: String!
    city: String!
  }

  type Game {
    id: String!
    home: Team!
    away: Team!
    network: String
    gameTime: DateTime!
    competition: String!
    venue: Venue!
  }

  type GamesForDate {
    date: DateTime!
    games: [Game!]!
  }

  type Schedule {
    buildDate: DateTime!
    gamesByDate: [GamesForDate!]!
  }

  type Query {
    getSchedule: Schedule! @skipAuth
  }
`;
