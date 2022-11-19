export interface Team {
  id: number;
  shortName: string;
  fullName: string;
  abbreviation: string;
  record?: TeamRecord;
  powerRank?: number;
  sport: Sport;
  logoUrl?: string;
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
  id: string;
  home: Team;
  away: Team;
  network?: string;
  gameTime: Date | string;
  competition: string;
  venue: Venue;
}

export enum Sport {
  "SOCCER" = "soccer",
  "BASKETBALL" = "basketball",
}
