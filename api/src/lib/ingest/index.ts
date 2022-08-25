import type {Game, Schedule, Team} from 'types/index';
import { DateTime } from 'luxon';

function collectCommonTeams(games: Game[]): Team[] {
  const teamMap = games
    .map(game => [game.home, game.away])
    .reduce((teams, currentTeams) => {
      currentTeams
        .forEach(team => teams.set(`${team.sport}-${team.abbreviation}`, team));
      return teams;
    }, new Map<string, Team>());
  return Array.from(teamMap.values());
}

function groupGamesByDate(allGames: Game[]): Record<string, Game[]> {
  const dateGamesMap = allGames.reduce((schedule, game: Game) => {
    const gameDate = DateTime.fromJSDate(game.gameTime)
      .setZone('America/New_York')
      .startOf('day')
      .toISO()
    if (schedule.has(gameDate)) {
      const games = schedule.get(gameDate);
      schedule.set(gameDate, [...games, game]);
    } else {
      schedule.set(gameDate, [game]);
    }
    return schedule;
  }, new Map<string, Game[]>());
  return Object.fromEntries(dateGamesMap);
}

export function fullScheduleFromGames(games: Game[]): Schedule {
  return {
    games: games,
    teams: collectCommonTeams(games),
    teamSchedules: new Map<string, Game[]>(),
    gamesByDate: groupGamesByDate(games)
  }
}
