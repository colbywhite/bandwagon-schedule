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
}

export interface Schedule {
  games: Game[];
}
