import { DateTime } from "luxon";
import type { Game, Team, TeamRecord } from "~/@types";
import { Sport } from "~/@types";
import thirdPartyClient from "./thirdPartyClient";
import type {
  RawMLSGame,
  RawMLSSchedule,
  RawMLSStandingEntry,
  RawMLSStandings,
  RawMLSTeam,
} from "./types";
import { retrieveFromStorage, saveToStorage } from "~/cache";
import { today } from "~/utils";

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
      team.abbreviation !== undefined && team.abbreviation.toLowerCase() === entry.club.abbreviation.toLowerCase()
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
    abbreviation: team.abbreviation || abbreviationFromFullName(team.fullName),
    shortName: team.shortName,
    fullName: team.fullName,
    powerRank: findTeamRank(team.optaId, rankings),
    sport: Sport.SOCCER,
    record: parseRecord(team, standings),
    logoUrl: team.logoColorUrl,
  };
}

function abbreviationFromFullName(name: string) {
  return name.split(' ').map(segment => segment.charAt(0)).join()
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
  standings: RawMLSStandings,
  rankings: number[]
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

export async function saveGames(
  ...args: Parameters<typeof thirdPartyClient.getMLSSchedule>
) {
  console.log("Retrieving", Sport.SOCCER, "games");
  return Promise.all([
    thirdPartyClient.getMLSSchedule(...args),
    thirdPartyClient.getMLSStandings(),
    thirdPartyClient.getRankings(),
  ])
    .then(([schedule, standings, rankings]) =>
      Promise.all([
        saveToStorage("mls-schedule", schedule),
        saveToStorage("mls-standings", standings),
        saveToStorage("mls-rankings", rankings),
      ])
    )
    .then((results) => parseRawGames(...results))
    .then((games) => saveToStorage("mls-games", games));
}

export async function getGames(date: DateTime = today()) {
  return retrieveFromStorage<Game[]>("mls-games", date);
}
