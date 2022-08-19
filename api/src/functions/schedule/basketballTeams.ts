import type { Team } from "types/index";

const teams: Array<Pick<Team, "shortName" | "fullName" | "abbreviation">> = [
  {
    shortName: "Hawks",
    fullName: "Atlanta Hawks",
    abbreviation: "ATL",
  },
  {
    shortName: "Nets",
    fullName: "Brooklyn Nets",
    abbreviation: "BKN",
  },
  {
    shortName: "Celtics",
    fullName: "Boston",
    abbreviation: "BOS",
  },
  {
    shortName: "Hornets",
    fullName: "Charlotte",
    abbreviation: "CHA",
  },
  {
    shortName: "Bulls",
    fullName: "Chicago",
    abbreviation: "CHI",
  },
  {
    shortName: "Cavaliers",
    fullName: "Cleveland Cavaliers",
    abbreviation: "CLE",
  },
  {
    shortName: "Mavericks",
    fullName: "Dallas Mavericks",
    abbreviation: "DAL",
  },
  {
    shortName: "Nuggets",
    fullName: "Denver Nuggets",
    abbreviation: "DEN",
  },
  {
    shortName: "Pistons",
    fullName: "Detroit",
    abbreviation: "DET",
  },
  {
    shortName: "Warriors",
    fullName: "Golden State",
    abbreviation: "GSW",
  },
];
export default teams;
