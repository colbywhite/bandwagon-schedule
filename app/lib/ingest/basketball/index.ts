import type { Game, Team } from "~/@types";
import { Sport } from "~/@types";

import thirdPartyClient, { parseDate } from "./thirdPartyClient";
import type { RawNBAGame, RawNBATeam } from "./types";
import { ID_INFO } from "~/lib/ingest/basketball/teamIds";
import { DateTime } from "luxon";

function parseShortTeamName({ strTeam, strAlternate }: RawNBATeam): string {
  if (strAlternate !== undefined && strAlternate.trim() !== "") {
    return strAlternate.trim();
  }
  const nameParts = strTeam.trim().split(" ");
  return nameParts[nameParts.length - 1];
}

function parseTeam(
  teamId: string,
  teams: RawNBATeam[],
  rankings: string[]
): Team {
  const team = teams.find((team) => team.idTeam === teamId);
  if (team === undefined) {
    throw new Error(`No team found for id ${teamId}`);
  }
  const nbaId = ID_INFO.find((i) => i.id === team.idTeam)?.nbaId;
  return {
    id: Number(team.idTeam),
    abbreviation: team.strTeamShort,
    shortName: parseShortTeamName(team),
    fullName: team.strTeam,
    powerRank: findTeamRank(team.idTeam, rankings),
    sport: Sport.basketball,
    logoUrl: nbaId
      ? `https://cdn.nba.com/logos/nba/${nbaId}/primary/L/logo.svg`
      : undefined,
  };
}

function parseRawGames(
  games: RawNBAGame[],
  teams: RawNBATeam[],
  rankings: string[]
): Game[] {
  return games.map((game) => {
    return {
      id: game.idEvent,
      competition: "NBA", // TODO determine postseason
      home: parseTeam(game.idHomeTeam, teams, rankings),
      away: parseTeam(game.idAwayTeam, teams, rankings),
      venue: {
        name: "TODO",
        city: "TODO",
      },
      gameTime: parseDate(game).toJSDate(),
    };
  });
}

function findTeamRank(teamId: string, rankings: string[]): number | undefined {
  const zeroIndexedRank = rankings.findIndex((id) => id === teamId);
  return zeroIndexedRank === -1 ? undefined : zeroIndexedRank + 1;
}

export default (
  ...args: Parameters<typeof thirdPartyClient.getNBASchedule>
) => {
  const getGames = Promise.all([
    thirdPartyClient.getNBASchedule(...args),
    thirdPartyClient.getNBATeams(),
    thirdPartyClient.getRankings(),
  ]).then(([schedule, teams, rankings]) =>
    parseRawGames(schedule, teams, rankings)
  );
  return getGames;
};
