export interface Team {
  id: number;
  shortName: string;
  fullName: string;
  abbreviation: string;
  record?: TeamRecord;
  powerRank?: number;
  sport: Sport;
}

export interface TeamRecord {
  wins: number;
  losses: number;
  ties?: number;
  conference: string;
  conferenceRank: number;
}

export interface Venue {
  name: string;
  city: string;
}

export interface Game {
  id: number | string;
  home: Team;
  away: Team;
  network?: string;
  gameTime: Date;
  competition: string;
  venue: Venue;
}

export interface Schedule {
  games: Game[];
  teams: Team[];
  teamSchedules: Map<string, Game[]>;
  gamesByDate: Record<string, Game[]>;
}

export type Sport = "soccer";
