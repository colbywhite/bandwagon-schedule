import type {
  Game,
  Schedule,
  Sport,
  Team,
  TeamRecord,
  Venue,
} from "types/index";
import type {
  RawMLSGame,
  RawMLSSchedule,
  RawMLSStandingEntry,
  RawMLSStandings,
  RawMLSTeam,
  RawMLSVenue,
} from "./types";
import thirdPartyClient from "./thirdPartyClient";

/**
 * This is a script to update the schedule data via the MLS's API at
 * https://sportapi.mlssoccer.com/api/matches?culture=en-us&dateFrom=2021-05-27&dateTo=2021-06-21
 */

const SOCCER: Sport = "soccer";

function parseLocation(venue: RawMLSVenue): Venue {
  return {
    name: venue.name,
    city: venue.city,
  };
}

const SPANISH_NETWORKS = ["UniMás", "TUDN"];

function parseNationalNetwork(game: RawMLSGame): string | undefined {
  const broadcaster = game.broadcasters.find(
    (b) =>
      b.broadcasterTypeLabel === "National TV" &&
      b.broadcasterType === "US TV" &&
      !SPANISH_NETWORKS.includes(b.broadcasterName)
  );
  return broadcaster?.broadcasterName;
}

function parseRecord(
  team: RawMLSTeam,
  standings: RawMLSStandings
): TeamRecord | undefined {
  const entry: RawMLSStandingEntry | undefined = standings.find(
    (entry) =>
      team.abbreviation.toLowerCase() === entry.club.abbreviation.toLowerCase()
  );
  if (entry === undefined) {
    return undefined;
  }
  return {
    wins: entry.statistics.total_wins,
    losses: entry.statistics.total_losses,
    ties: entry.statistics.total_draws,
    conference: entry.group_id,
    conferenceRank: entry.position,
  };
}

function parseTeam(
  team: RawMLSTeam,
  rankings: string[],
  standings: RawMLSStandings
): Team {
  return {
    abbreviation: team.abbreviation,
    shortName: team.shortName,
    fullName: team.fullName,
    powerRank: findTeamRank(team.abbreviation, rankings),
    sport: SOCCER,
    record: parseRecord(team, standings),
  };
}

function parseRawGames(
  games: RawMLSSchedule,
  rankings: string[],
  standings: RawMLSStandings
): Game[] {
  return games.map((game, index) => {
    const parsed: Game = {
      id: index,
      competition: game.competition.name,
      home: parseTeam(game.home, rankings, standings),
      away: parseTeam(game.away, rankings, standings),
      venue: {
        name: game.venue.name,
        city: game.venue.city,
      },
      network: parseNationalNetwork(game),
      gameTime: new Date(game.matchDate),
    };
    return parsed;
  });
}

function findTeamRank(
  teamName: string,
  rankings: string[]
): number | undefined {
  const zeroIndexedRank = rankings.findIndex(
    (name) => teamName.toLowerCase() === name.toLowerCase()
  );
  return zeroIndexedRank === -1 ? undefined : zeroIndexedRank + 1;
}

export default () => {
  const getGames = Promise.all([
    thirdPartyClient.getMLSSchedule(),
    thirdPartyClient.getRankings(),
    thirdPartyClient.getMLSStandings(),
  ]).then(([schedule, rankings, standings]) =>
    parseRawGames(schedule, rankings, standings)
  );
  const getTeams = getGames.then(() => [] as Team[]);
  return Promise.all([getGames, getTeams]).then(([games, teams]) => {
    const schedule: Schedule = {
      games: games,
      teams: teams,
      teamSchedules: new Map(),
      gamesByDate: {},
    };
    return schedule;
  });
};
