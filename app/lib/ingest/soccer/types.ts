export type RawMLSSchedule = RawMLSGame[];

export interface RawMLSGame {
  optaId: number;
  slug: string;
  isTimeTbd: boolean;
  leagueMatchTitle: string;
  competition: RawMLSCompetition;
  broadcasters: Broadcaster[];
  matchDate: string;
  home: RawMLSTeam;
  away: RawMLSTeam;
  venue: RawMLSVenue;
}

export interface RawMLSVenue {
  name: string;
  city: string;
  backgroundImageSlug: string;
  venueOptaId: string;
}

export interface RawMLSCompetition {
  optaId: number;
  slug: string;
  matchType: string;
  name: string;
  shortName: string;
}

export interface RawMLSTeam {
  optaId: number;
  fullName: string;
  slug: string;
  shortName: string;
  abbreviation?: string;
  backgroundColor: string;
  logoBWSlug: string;
  logoColorSlug: string;
  logoColorUrl: string;
  crestColorSlug: string;
}

export interface Broadcaster {
  broadcasterTypeLabel: "Streaming" | "National TV" | "US TV" | "TV";
  broadcasterName: string;
  broadcasterStreamingURL: string;
  broadcasterType: "US Streaming" | "Canada Streaming" | "US TV" | "Canada TV";
}

export type RawMLSStandings = RawMLSStandingEntry[];

export interface RawMLSStandingEntry {
  group_id: string;
  group_name: string;
  home_position: number;
  away_position: number;
  start_day_position: number;
  isLive: false;
  position: number;
  club: {
    abbreviation: string;
    optaId: number;
    fullName: string;
    slug: string;
    shortName: string;
    backgroundColor: string;
    logoBWSlug: string;
    logoColorSlug: string;
    logoColorUrl: string;
    crestColorSlug: string;
  };
  statistics: {
    total_draws: number;
    total_goal_differential: number;
    total_goal_differential_pg: number;
    total_goals: number;
    total_goals_pg: number;
    total_goals_conceded: number;
    total_losses: number;
    total_matches: number;
    total_points: number;
    total_points_pg: number;
    total_wins: number;
    total_wins_pg: number;
    total_shootout_wins: number;
    total_disciplinary_points: number;
    total_disciplinary_points_pg: number;
    home_draws: number;
    home_goal_differential: number;
    home_goal_differential_pg: number;
    home_goals: number;
    home_goals_pg: number;
    home_goals_conceded: number;
    home_losses: number;
    home_matches: number;
    home_points: number;
    home_points_pg: number;
    home_wins: number;
    home_shootout_wins: number;
    away_draws: number;
    away_goal_differential: number;
    away_goal_differential_pg: number;
    away_goals: number;
    away_goals_pg: number;
    away_goals_conceded: number;
    away_losses: number;
    away_matches: number;
    away_points: number;
    away_points_pg: number;
    away_wins: number;
    away_shootout_wins: number;
  };
}
