export interface Team {
  shortName: string;
  fullName: string;
  abbreviation: string;
  record: TeamRecord;
  powerRank: number;
}

export interface TeamRecord {
  wins: number;
  losses: number;
  ties?: number;
  conference: string;
  conferenceRank: number;
}

export interface Game {
  id: number;
  home: Team;
  away: Team;
  network: string;
  gameTime: Date;
  competitionDescription: string;
  location: {
    arena: string;
    city: string;
    subdivision: string;
  };
}

export type Schedule = Record<string, Game[]>;
