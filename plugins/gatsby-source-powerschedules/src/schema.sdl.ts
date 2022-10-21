const schema = `
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
    type Team implements Node {
        id: Int!
        shortName: String!
        fullName: String!
        abbreviation: String!
        record: TeamRecord
        powerRank: Int
        sport: Sport!
        logo: GatsbyImageData!
        logoUrl: String
    }
    type Venue {
        name: String!
        city: String!
    }
    type Game implements Node {
        id: String!
        home_id: String!
        home: Team!
        away_id: String!
        away: Team!
        network: String
        gameTime: Date!
        competition: String!
        venue: Venue!
    }
    type GamesOnDate {
        date: Date!
        games: [Game!]!
        totalCount: Int!
    }
    type Query {
        gamesByDate(
            filter: GameFilterInput
            limit: Int
            skip: Int
            sort: GameSortInput
        ): [GamesOnDate!]!
    }
`;

export default schema;
