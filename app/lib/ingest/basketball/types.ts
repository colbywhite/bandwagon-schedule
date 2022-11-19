export interface RawNBASchedule {
  events: RawNBAGame[];
}

export interface RawNBAGame {
  idEvent: string;
  idAPIfootball: string;
  strEvent: string;
  strEventAlternate: string;
  strFilename: string;
  strSport: string;
  idLeague: string;
  strLeague: string;
  strSeason: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string;
  intRound: string;
  intAwayScore: string;
  strTimestamp: string;
  dateEvent: string;
  dateEventLocal: string;
  strTime: string;
  strTimeLocal: string;
  idHomeTeam: string;
  idAwayTeam: string;
  strResult: string;
  strVenue: string;
  strCountry: string;
  strCity: string;
  strPoster: string;
  strSquare: string;
  strThumb: string;
  strBanner: string;
  strVideo: string;
  strStatus: string;
  strPostponed: string;
  strLocked: string;
}

export interface RawNBATeam {
  idTeam: string;
  idAPIfootball: string;
  intLoved: string;
  strTeam: string;
  strTeamShort: string;
  strAlternate: string;
  intFormedYear: string;
  strSport: string;
  strLeague: string;
  idLeague: string;
  strStadium: string;
}

export interface NationalTVBroadcaster {
  broadcasterScope: "natl";
  broadcasterMedia: "tv";
  broadcasterId: number;
  broadcasterDisplay: "NBA TV" | "TNT" | "ESPN" | "ESPN2" | "ABC" | "ABC/ESPN";
  broadcasterAbbreviation:
    | "NBA TV"
    | "TNT"
    | "ESPN"
    | "ESPN2"
    | "ABC"
    | "ABC/ESPN";
  regionId: 1;
}

export type ParsedNBAStandings = ParsedNBAStandingEntry[];
export type ParsedNBAStandingEntry = Record<
  RawNBAStandingsHeader,
  string | number | null
>;

export interface RawNBAStandings {
  resource: "leaguestandings";
  resultSets: RawNBAStandingsResultSet[];
}

export interface RawNBAStandingsResultSet {
  name: "Standings";
  headers: RawNBAStandingsHeader[];
  rowSet: Array<Array<number | string | null>>;
}

export type RawNBAStandingsHeader =
  | "LeagueID"
  | "SeasonID"
  | "TeamID"
  | "TeamCity"
  | "TeamName"
  | "TeamSlug"
  | "Conference"
  | "ConferenceRecord"
  | "PlayoffRank"
  | "ClinchIndicator"
  | "Division"
  | "DivisionRecord"
  | "DivisionRank"
  | "WINS"
  | "LOSSES"
  | "WinPCT"
  | "LeagueRank"
  | "Record"
  | "HOME"
  | "ROAD"
  | "L10"
  | "Last10Home"
  | "Last10Road"
  | "OT"
  | "ThreePTSOrLess"
  | "TenPTSOrMore"
  | "LongHomeStreak"
  | "strLongHomeStreak"
  | "LongRoadStreak"
  | "strLongRoadStreak"
  | "LongWinStreak"
  | "LongLossStreak"
  | "CurrentHomeStreak"
  | "strCurrentHomeStreak"
  | "CurrentRoadStreak"
  | "strCurrentRoadStreak"
  | "CurrentStreak"
  | "strCurrentStreak"
  | "ConferenceGamesBack"
  | "DivisionGamesBack"
  | "ClinchedConferenceTitle"
  | "ClinchedDivisionTitle"
  | "ClinchedPlayoffBirth"
  | "ClinchedPlayIn"
  | "EliminatedConference"
  | "EliminatedDivision"
  | "AheadAtHalf"
  | "BehindAtHalf"
  | "TiedAtHalf"
  | "AheadAtThird"
  | "BehindAtThird"
  | "TiedAtThird"
  | "Score100PTS"
  | "OppScore100PTS"
  | "OppOver500"
  | "LeadInFGPCT"
  | "LeadInReb"
  | "FewerTurnovers"
  | "PointsPG"
  | "OppPointsPG"
  | "DiffPointsPG"
  | "vsEast"
  | "vsAtlantic"
  | "vsCentral"
  | "vsSoutheast"
  | "vsWest"
  | "vsNorthwest"
  | "vsPacific"
  | "vsSouthwest"
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec"
  | "Score_80_Plus"
  | "Opp_Score_80_Plus"
  | "Score_Below_80"
  | "Opp_Score_Below_80";
