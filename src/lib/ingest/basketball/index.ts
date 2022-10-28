import {DateTime} from 'luxon';
import type {Game, Team, TeamRecord} from '../../../../@types';
import {Sport} from '../../../../@types';

import {fullScheduleFromGames} from '../index';

import thirdPartyClient from './thirdPartyClient';
import type {ParsedNBAStandingEntry, ParsedNBAStandings, RawNBAGame, RawNBAGamesOnDate, RawNBATeam} from './types';


function parseNationalNetwork({broadcasters: {nationalTvBroadcasters}}: RawNBAGame): string | undefined {
  const broadcaster = nationalTvBroadcasters.find(
    (b) => b.broadcasterScope === 'natl' && b.broadcasterMedia == 'tv'
  );
  return broadcaster?.broadcasterDisplay;
}

function parseRecord(
  team: RawNBATeam,
  standings: ParsedNBAStandings
): TeamRecord | undefined {
  const entry: ParsedNBAStandingEntry | undefined = standings.find(
    (entry) =>
      team.teamId === Number(entry.TeamID)
  );
  if (entry === undefined) {
    return undefined;
  }
  return {
    wins: Number(entry.WINS),
    losses: Number(entry.LOSSES),
    conference: String(entry.Conference),
    conferenceRank: Number(entry.PlayoffRank)
  };
}

function parseTeam(
  team: RawNBATeam,
  rankings: number[],
  standings: ParsedNBAStandings
): Team {
  return {
    id: team.teamId,
    abbreviation: team.teamTricode,
    shortName: team.teamName,
    fullName: team.teamName,
    powerRank: findTeamRank(team.teamId, rankings),
    sport: Sport.basketball,
    record: parseRecord(team, standings),
    logoUrl: `https://cdn.nba.com/logos/nba/${team.teamId}/primary/L/logo.svg`
  };
}

function parseRawGames(
  games: RawNBAGamesOnDate[],
  rankings: number[],
  standings: ParsedNBAStandings
): Game[] {
  return games.reduce((parsedGames, {games: rawGames}) => {
    const games: Game[] = rawGames.map(rawGame => ({
      id: rawGame.gameId,
      competition: 'NBA Regular Season',
      home: parseTeam(rawGame.homeTeam, rankings, standings),
      away: parseTeam(rawGame.awayTeam, rankings, standings),
      venue: {
        name: rawGame.arenaName,
        city: rawGame.arenaCity
      },
      network: parseNationalNetwork(rawGame),
      gameTime: new Date(rawGame.gameDateTimeUTC)
    }));
    return [...parsedGames, ...games];
  }, [] as Game[]);
}

function findTeamRank(teamId: number, rankings: number[]): number | undefined {
  const zeroIndexedRank = rankings.findIndex((id) => id === teamId);
  return zeroIndexedRank === -1 ? undefined : zeroIndexedRank + 1;
}

export default (
  ...args: Parameters<typeof thirdPartyClient.getNBASchedule>
) => {
  const getGames = Promise.all([
    thirdPartyClient.getNBASchedule(...args),
    thirdPartyClient.getRankings(),
    thirdPartyClient.getNBAStandings()
  ]).then(([schedule, rankings, standings]) =>
    parseRawGames(schedule, rankings, standings)
  );
  return getGames;
}
