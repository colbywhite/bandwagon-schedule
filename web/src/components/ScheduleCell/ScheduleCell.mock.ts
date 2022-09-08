// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  getSchedule: {
    buildDate: "2022-09-08T03:53:19.923Z",
    gamesByDate: [
      {
        date: "2022-09-09T04:00:00.000Z",
        games: [
          {
            id: "2022-09-09.columbus-montréal.regular-season",
            home: {
              id: 1616,
              shortName: "Montréal",
              fullName: "CF Montréal",
              abbreviation: "MTL",
              record: {
                wins: 16,
                losses: 9,
                ties: 4,
                conference: "East",
                conferenceRank: 2,
                __typename: "TeamRecord" as const,
              },
              powerRank: 3,
              sport: "soccer" as const,
              __typename: "Team" as const,
            },
            away: {
              id: 454,
              shortName: "Columbus",
              fullName: "Columbus Crew",
              abbreviation: "CLB",
              record: {
                wins: 9,
                losses: 6,
                ties: 13,
                conference: "East",
                conferenceRank: 6,
                __typename: "TeamRecord" as const,
              },
              powerRank: 11,
              sport: "soccer" as const,
              __typename: "Team" as const,
            },
            network: null,
            gameTime: "2022-09-09T23:30:00.000Z",
            competition: "MLS Regular Season",
            venue: {
              name: "Stade Saputo",
              city: "Montreal",
              __typename: "Venue" as const,
            },
            __typename: "Game" as const,
          },
        ],
        __typename: "GamesForDate" as const,
      },
    ],
  },
});
