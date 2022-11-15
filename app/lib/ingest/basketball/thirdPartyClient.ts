import axios from "axios";
import type { Cheerio, CheerioAPI } from "cheerio";
import cheerio from "cheerio";
import type { DataNode, Element } from "domhandler";
import { DateTime } from "luxon";

import type {
  ParsedNBAStandingEntry,
  ParsedNBAStandings,
  RawNBAGamesOnDate,
  RawNBASchedule,
  RawNBAStandings,
  RawNBATeam,
} from "./types";
import { RawNBAGame } from "./types";
import { ID_INFO } from "~/lib/ingest/basketball/teamIds";

const LEAGUE_ID = "4387";
const SEASON = "2022-2023";
const DEFAULT_TIME_ZONE = "America/New_York";
const START_OF_REGULAR_SEASON = DateTime.fromISO("2022-10-18T00:00:00", {
  zone: DEFAULT_TIME_ZONE,
});

export function parseDate({ dateEvent, strTime }: RawNBAGame): DateTime {
  return DateTime.fromISO(`${dateEvent}T${strTime}`, { zone: "UTC" });
}

function getRankings(): Promise<string[]> {
  const source = "http://www.powerrankingsguru.com/nba/team-power-rankings.php";
  return axios
    .get(source)
    .then(({ data }) => data as string)
    .then(cheerio.load)
    .then((parser: CheerioAPI) =>
      parser(
        "table.rankings-table > tbody > tr > td:nth-child(2) > div.team-name-v2 > span.abbrv"
      )
    )
    .then((spanNodes: Cheerio<Element>) =>
      spanNodes
        .toArray()
        .map((node: Element) =>
          (node.children[0] as DataNode).data.toLowerCase()
        )
        .map((abbreviation) =>
          ID_INFO.find(
            (info) => info.powerRankingGuruAbbreviation === abbreviation
          )
        )
        .filter(isDefined)
        .map((info) => info.id)
    );
}

function isDefined<T>(val: T | undefined): val is T {
  return val !== undefined;
}

/**
 * @returns true if there are games present that are not preseason games (i.e. was after START_OF_REGULAR_SEASON)
 */
function containsValidGames(game: RawNBAGame): boolean {
  const gameTime = parseDate(game).setZone(DEFAULT_TIME_ZONE);
  return gameTime.isValid && gameTime >= START_OF_REGULAR_SEASON;
}

function containsGamesWithinRange(
  min: DateTime,
  max: DateTime,
  game: RawNBAGame
): boolean {
  const gameTime = parseDate(game).setZone(DEFAULT_TIME_ZONE);
  return gameTime.isValid && min <= gameTime && gameTime <= max;
}

function today() {
  return DateTime.now().setZone("America/New_York").startOf("day");
}

function aWeekFromNow() {
  return DateTime.now()
    .setZone("America/New_York")
    .startOf("day")
    .plus({ week: 1 });
}

function getNBASchedule(
  min: DateTime = today(),
  max: DateTime = aWeekFromNow()
): Promise<RawNBAGame[]> {
  const isWithinRange = containsGamesWithinRange.bind(null, min, max);
  const key = process.env.SPORT_DB_KEY || process.env.VITE_SPORT_DB_KEY;
  const SCHEDULE_URL = `https://www.thesportsdb.com/api/v1/json/${key}/eventsseason.php?id=${LEAGUE_ID}&s=${SEASON}`;
  return axios
    .get(SCHEDULE_URL)
    .then(({ data }) => data as RawNBASchedule)
    .then(({ events }) =>
      events.filter(containsValidGames).filter(isWithinRange)
    );
}

function getNBATeams() {
  const key = process.env.SPORT_DB_KEY || process.env.VITE_SPORT_DB_KEY;
  const TEAMS_URL = `https://www.thesportsdb.com/api/v1/json/${key}/lookup_all_teams.php?id=${LEAGUE_ID}`;
  return axios
    .get(TEAMS_URL)
    .then(({ data }) => data as { teams: RawNBATeam[] })
    .then(({ teams }) => teams);
}

export default {
  getRankings,
  getNBASchedule,
  getNBATeams,
};
