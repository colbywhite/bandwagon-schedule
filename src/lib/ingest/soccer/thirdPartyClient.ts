import axios from "axios";
import type { Cheerio, CheerioAPI } from "cheerio";
import cheerio from "cheerio";
import type { DataNode, Element } from "domhandler";
import { DateTime } from "luxon";

import type { RawMLSGame, RawMLSSchedule, RawMLSStandings } from "./types";

/**
 * There are some teams whose abbreviation on powerrankingsguru.com don't match the ones on mlssoccer.com.
 * This resolves the differences.
 */

const ABBREVIATION_MAP: Record<string, number> = {
  lafc: 11690,
  phi: 5513,
  nyc: 9668,
  atx: 15296,
  mtl: 1616,
  nsh: 15154,
  dal: 1903,
  clb: 454,
  sea: 3500,
  rsl: 1899,
  col: 436,
  por: 1581,
  atl: 11091,
  cin: 11504,
  orl: 6900,
  mia: 14880,
  chi: 1207,
  van: 1708,
  tor: 2077,
  clt: 16629,
  skc: 421,
  hou: 1897,
  nwe: 928,
  nwy: 399,
  mnu: 6977,
  dcu: 1326,
  lag: 1230,
  san: 1131,
};
const CURRENT_SEASON = 2022;

function getRankings(): Promise<number[]> {
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
        .map((abbreviation) => ABBREVIATION_MAP[abbreviation] || -1)
        .filter((id) => id > -1)
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

function isGameWithinWeek(
  min: DateTime,
  max: DateTime,
  { matchDate }: RawMLSGame
): boolean {
  const date = DateTime.fromISO(matchDate);
  return date.isValid && min <= date && date <= max;
}

function aWeekAgo() {
  return DateTime.now()
    .setZone("America/New_York")
    .startOf("day")
    .minus({ week: 1 });
}

function aWeekFromNow() {
  return DateTime.now()
    .setZone("America/New_York")
    .startOf("day")
    .plus({ week: 1 });
}

function getMLSSchedule(
  min: DateTime = aWeekAgo(),
  max: DateTime = aWeekFromNow()
): Promise<RawMLSSchedule> {
  // since the API is not precise, add buffer and filter manually
  const adjustedMin = min.minus({ week: 1 });
  const adjustedMax = max.plus({ week: 1 });
  const isWithinWeek = isGameWithinWeek.bind(null, min, max);
  const SCHEDULE_URL =
    "https://sportapi.mlssoccer.com/api/matches?culture=en-us" +
    `&dateFrom=${adjustedMin.toFormat(
      "yyyy-MM-dd"
    )}&dateTo=${adjustedMax.toFormat("yyyy-MM-dd")}` +
    "&excludeSecondaryTeams=true";
  return axios
    .get(SCHEDULE_URL)
    .then(({ data }) => data as RawMLSSchedule)
    .then((schedule) =>
      schedule.filter(isValidCompetition).filter(isWithinWeek)
    );
}

function getMLSStandings(): Promise<RawMLSStandings> {
  const STANDINGS_URL =
    "https://sportapi.mlssoccer.com/api/standings/live" +
    `?isLive=false&seasonId=${CURRENT_SEASON}&competitionId=${MLS_SEASON_ID}`;
  return axios.get(STANDINGS_URL).then(({ data }) => data);
}

export default {
  getRankings,
  getMLSSchedule,
  getMLSStandings,
};
