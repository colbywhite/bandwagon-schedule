import type {Game, Team} from 'types/index';

export function collectCommonTeams(games: Game[]): Team[] {
  const teamMap = games
    .map(game => [game.home, game.away])
    .reduce((teams, currentTeams) => {
      currentTeams
        .forEach(team => teams.set(`${team.sport}-${team.abbreviation}`, team));
      return teams;
    }, new Map<string, Team>());
  return Array.from(teamMap.values());
}
