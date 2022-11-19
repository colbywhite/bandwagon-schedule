import { getGames as getBasketballGames, saveGames as saveBasketballGames } from "~/lib/ingest/basketball";
import { getGames as getSoccerGames, saveGames as saveSoccerGames } from "~/lib/ingest/soccer";
import type { Game, Team } from "~/@types";
import { toDateTime } from "~/utils";

export function collectCommonTeams(games: Game[]): Team[] {
  const teamMap = games
    .map((game) => [game.home, game.away])
    .reduce((teams, currentTeams) => {
      currentTeams.forEach((team) =>
        teams.set(`${team.sport}-${team.abbreviation}`, team)
      );
      return teams;
    }, new Map<string, Team>());
  return Array.from(teamMap.values());
}

export function groupGamesByDate(allGames: Game[]): Record<string, Game[]> {
  const dateGamesMap = allGames.reduce((schedule, game: Game) => {
    const gameDate = toDateTime(game.gameTime)
      .setZone("America/New_York")
      .startOf("day")
      .toISO();
    const games = schedule.get(gameDate);
    if (games) {
      schedule.set(gameDate, [...games, game]);
    } else {
      schedule.set(gameDate, [game]);
    }
    return schedule;
  }, new Map<string, Game[]>());
  return Object.fromEntries(dateGamesMap);
}

export function groupByTeam(allGames: Game[]): Record<number, Game[]> {
  const teamMap = allGames.reduce((schedule, game) => {
    const teams = [game.home, game.away];
    teams.forEach((team) => {
      const previousGames: Game[] | undefined = schedule.get(team.id);
      if (previousGames !== undefined) {
        schedule.set(team.id, [...previousGames, game]);
      } else {
        schedule.set(team.id, [game]);
      }
    });
    return schedule;
  }, new Map<number, Game[]>());
  return Object.fromEntries(teamMap);
}

export async function getAllGames() {
  return Promise.all([getBasketballGames(), getSoccerGames()]).then((games) =>
    games.flat()
  );
}

export async function saveAllGames() {
  return Promise.all([saveBasketballGames(), saveSoccerGames()]).then((games) =>
    games.flat()
  );
}
