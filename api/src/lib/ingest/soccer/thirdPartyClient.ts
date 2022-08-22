import type { Cheerio, CheerioAPI } from "cheerio";
import cheerio from "cheerio";
import type { DataNode, Element } from "domhandler";
import type { RawMLSGame, RawMLSSchedule, RawMLSStandings } from "./types";
import axios from "axios";

/**
 * There are some teams whose abbreviation on powerrankingsguru.com don't match the ones on mlssoccer.com.
 * This resolves the differences.
 */
const ABBREVIATION_MAP: Record<string, string> = {
  nwe: "ne",
  nwy: "rbny",
  mnu: "min",
  dcu: "dc",
  lag: "la",
  san: "sj",
};
const CURRENT_SEASON = 2022;

export function getRankings(): Promise<string[]> {
  const source =
    "http://www.powerrankingsguru.com/soccer/mls/team-power-rankings.php";
  return axios
    .get(source)
    .then(({ data }) => data as string)
    .then(cheerio.load)
    .then((parser: CheerioAPI) =>
      parser(
        "table.gfc-rankings-table > tbody > tr > td:nth-child(2) > div.gfc-team-name > span.abbrv"
      )
    )
    .then((spanNodes: Cheerio<Element>) =>
      spanNodes
        .toArray()
        .map((node: Element) =>
          (node.children[0] as DataNode).data.toLowerCase()
        )
        .map((abbreviation) => ABBREVIATION_MAP[abbreviation] || abbreviation)
    );
}

const US_OPEN_CUP_ID = 557;
const MLS_SEASON_ID = 98;
const CANADIAN_CUP_ID = 552;
const CAMPEONES_CUP_ID = 957;
const CHAMPIONS_LEAGUE_ID = 549;
const LEAGUES_CUP_ID = 1045;
const VALID_COMPETITIONS = [
  US_OPEN_CUP_ID,
  MLS_SEASON_ID,
  CANADIAN_CUP_ID,
  CAMPEONES_CUP_ID,
  CHAMPIONS_LEAGUE_ID,
  LEAGUES_CUP_ID,
];

function isValidCompetition({ competition }: RawMLSGame): boolean {
  return VALID_COMPETITIONS.includes(competition.optaId);
}

export function getMLSSchedule(): Promise<RawMLSSchedule> {
  const SCHEDULE_URL =
    "https://sportapi.mlssoccer.com/api/matches?culture=en-us" +
    `&dateFrom=${CURRENT_SEASON}-01-01&dateTo=${CURRENT_SEASON}-12-31` +
    "&excludeSecondaryTeams=true";
  return axios
    .get(SCHEDULE_URL)
    .then(({ data }) => data as RawMLSSchedule)
    .then((schedule) => schedule.filter(isValidCompetition));
}

export function getMLSStandings(): Promise<RawMLSStandings> {
  const STANDINGS_URL =
    "https://sportapi.mlssoccer.com/api/standings/live" +
    `?isLive=false&seasonId=${CURRENT_SEASON}&competitionId=${MLS_SEASON_ID}`;
  return axios.get(STANDINGS_URL).then(({ data }) => data);
}
