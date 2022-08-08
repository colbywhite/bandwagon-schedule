export interface Team {
  shortName: string;
  fullName: string;
  abbreviation: string;
}

export interface Game {
  id: number;
  home: Team;
  away: Team;
  network: string;
  gameTime: Date;
}

export type Schedule = Record<string, Game[]>
