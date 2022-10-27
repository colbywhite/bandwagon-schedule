
export interface RawNBASchedule {
  meta: {
    version: number;
    request: string;
    time: string;
  },
  leagueSchedule: {
    seasonYear: string;
    leagueId: string;
    gameDates: RawNBAGamesOnDate[]
  }
}

export interface RawNBAGamesOnDate {
  gameDate: string;
  games: RawNBAGame[];
}

export interface RawNBAGame {
  gameId: string;
  gameCode: string;
  gameStatus: number;
  gameStatusText: string;
  gameSequence: number;
  gameDateEst: string;
  gameTimeEst: string;
  gameDateTimeEst: string;
  gameDateUTC: string;
  gameTimeUTC: string;
  gameDateTimeUTC: string;
  homeTeamTime: string;
  awayTeamTime: string;
  day: string;
  monthNum: number;
  weekNumber: number;
  weekName: string;
  ifNecessary: boolean;
  seriesGameNumber: string;
  seriesText: string;
  arenaName: string;
  arenaState: string;
  arenaCity: string;
  postponedStatus: string;
  branchLink: string;
  broadcasters: {
    nationalTvBroadcasters: NationalTVBroadcaster []
  };
  homeTeam: RawNBATeam;
  awayTeam: RawNBATeam;
}

export interface RawNBATeam {
  teamId: number;
  teamName: string;
  teamCity: string;
  teamTricode: string;
  teamSlug: string;
  wins: number;
  losses: number;
  score: number;
  seed: number;
}

export interface NationalTVBroadcaster {
  broadcasterScope: 'natl';
  broadcasterMedia: 'tv';
  broadcasterId: number;
  broadcasterDisplay: 'NBA TV' | 'TNT' | 'ESPN' | 'ESPN2' | 'ABC' | 'ABC/ESPN';
  broadcasterAbbreviation: 'NBA TV' | 'TNT' | 'ESPN' | 'ESPN2' | 'ABC' | 'ABC/ESPN';
  regionId: 1;
}

export type ParsedNBAStandings = ParsedNBAStandingEntry[];
export type ParsedNBAStandingEntry = Record<RawNBAStandingsHeader, string | number | null>

export interface RawNBAStandings {
  resource: 'leaguestandings';
  resultSets: RawNBAStandingsResultSet[];
}

export interface RawNBAStandingsResultSet {
  name: 'Standings';
  headers: RawNBAStandingsHeader[];
  rowSet: Array<Array<number | string | null>>;
}

export type RawNBAStandingsHeader =
  'LeagueID' |
  'SeasonID' |
  'TeamID' |
  'TeamCity' |
  'TeamName' |
  'TeamSlug' |
  'Conference' |
  'ConferenceRecord' |
  'PlayoffRank' |
  'ClinchIndicator' |
  'Division' |
  'DivisionRecord' |
  'DivisionRank' |
  'WINS' |
  'LOSSES' |
  'WinPCT' |
  'LeagueRank' |
  'Record' |
  'HOME' |
  'ROAD' |
  'L10' |
  'Last10Home' |
  'Last10Road' |
  'OT' |
  'ThreePTSOrLess' |
  'TenPTSOrMore' |
  'LongHomeStreak' |
  'strLongHomeStreak' |
  'LongRoadStreak' |
  'strLongRoadStreak' |
  'LongWinStreak' |
  'LongLossStreak' |
  'CurrentHomeStreak' |
  'strCurrentHomeStreak' |
  'CurrentRoadStreak' |
  'strCurrentRoadStreak' |
  'CurrentStreak' |
  'strCurrentStreak' |
  'ConferenceGamesBack' |
  'DivisionGamesBack' |
  'ClinchedConferenceTitle' |
  'ClinchedDivisionTitle' |
  'ClinchedPlayoffBirth' |
  'ClinchedPlayIn' |
  'EliminatedConference' |
  'EliminatedDivision' |
  'AheadAtHalf' |
  'BehindAtHalf' |
  'TiedAtHalf' |
  'AheadAtThird' |
  'BehindAtThird' |
  'TiedAtThird' |
  'Score100PTS' |
  'OppScore100PTS' |
  'OppOver500' |
  'LeadInFGPCT' |
  'LeadInReb' |
  'FewerTurnovers' |
  'PointsPG' |
  'OppPointsPG' |
  'DiffPointsPG' |
  'vsEast' |
  'vsAtlantic' |
  'vsCentral' |
  'vsSoutheast' |
  'vsWest' |
  'vsNorthwest' |
  'vsPacific' |
  'vsSouthwest' |
  'Jan' |
  'Feb' |
  'Mar' |
  'Apr' |
  'May' |
  'Jun' |
  'Jul' |
  'Aug' |
  'Sep' |
  'Oct' |
  'Nov' |
  'Dec' |
  'Score_80_Plus' |
  'Opp_Score_80_Plus' |
  'Score_Below_80' |
  'Opp_Score_Below_80';
