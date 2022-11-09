import { DateTime } from "luxon";
import type { Game, Sport, Team, TeamRecord } from "~/@types";

import { fullScheduleFromGames } from "../index";

import thirdPartyClient from "./thirdPartyClient";
import type {
  RawMLSGame,
  RawMLSSchedule,
  RawMLSStandingEntry,
  RawMLSStandings,
  RawMLSTeam,
} from "./types";

const SOCCER: Sport = "soccer";
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
  rankings: number[],
  standings: RawMLSStandings
): Team {
  return {
    id: team.optaId,
    abbreviation: team.abbreviation,
    shortName: team.shortName,
    fullName: team.fullName,
    powerRank: findTeamRank(team.optaId, rankings),
    sport: SOCCER,
    record: parseRecord(team, standings),
  };
}

function buildId(game: RawMLSGame) {
  const dateStr = DateTime.fromJSDate(new Date(game.matchDate))
    .setZone("America/New_York")
    .startOf("day")
    .toISODate();
  const sanitizeName = (val: string) =>
    val.replace(/\./g, "").replace(/ /g, "-");
  return `${dateStr}.${sanitizeName(game.away.shortName)}-${sanitizeName(
    game.home.shortName
  )}.${sanitizeName(game.competition.shortName)}`.toLowerCase();
}

function parseRawGames(
  games: RawMLSSchedule,
  rankings: number[],
  standings: RawMLSStandings
): Game[] {
  return games.map((game) => {
    const parsed: Game = {
      id: buildId(game),
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

function findTeamRank(teamId: number, rankings: number[]): number | undefined {
  const zeroIndexedRank = rankings.findIndex((id) => id === teamId);
  return zeroIndexedRank === -1 ? undefined : zeroIndexedRank + 1;
}

export default (
  ...args: Parameters<typeof thirdPartyClient.getMLSSchedule>
) => {
  const getGames = Promise.all([
    thirdPartyClient.getMLSSchedule(...args),
    thirdPartyClient.getRankings(),
    thirdPartyClient.getMLSStandings(),
  ]).then(([schedule, rankings, standings]) =>
    parseRawGames(schedule, rankings, standings)
  );
  return getGames.then(fullScheduleFromGames);
};
