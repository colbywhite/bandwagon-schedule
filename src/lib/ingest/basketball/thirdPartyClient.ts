import axios from 'axios';
import type {Cheerio, CheerioAPI} from 'cheerio';
import cheerio from 'cheerio';
import type {DataNode, Element} from 'domhandler';
import {DateTime} from 'luxon';

import type {
  ParsedNBAStandingEntry,
  ParsedNBAStandings,
  RawNBAGamesOnDate,
  RawNBASchedule,
  RawNBAStandings
} from './types';

const LEAGUE_ID = '00';
const SEASON = '2022-23';
const HEADERS = {
  'Host': 'stats.nba.com',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'x-nba-stats-origin': 'stats',
  'x-nba-stats-token': 'true',
  'Connection': 'keep-alive',
  'Referer': 'https://stats.nba.com/',
  'Pragma': 'no-cache',
  'Cache-Control': 'no-cache'
};

/**
 * There are some teams whose abbreviation on powerrankingsguru.com don't match the ones on nba.com.
 * This resolves the differences.
 */
const ABBREVIATION_MAP: Record<string, number> = {
  phx: 1610612756,
  bos: 1610612738,
  dal: 1610612742,
  mil: 1610612749,
  no: 1610612740,
  cle: 1610612739,
  tor: 1610612761,
  phi: 1610612755,
  mem: 1610612763,
  gs: 1610612744,
  por: 1610612757,
  atl: 1610612737,
  min: 1610612750,
  utah: 1610612762,
  ny: 1610612752,
  cha: 1610612766,
  mia: 1610612748,
  bkn: 1610612751,
  den: 1610612743,
  lac: 1610612746,
  wsh: 1610612764,
  chi: 1610612741,
  sa: 1610612759,
  lal: 1610612747,
  sac: 1610612758,
  okc: 1610612760,
  ind: 1610612754,
  orl: 1610612753,
  hou: 1610612745,
  det: 1610612765
};

function getRankings(): Promise<number[]> {
  const source =
    'http://powerrankingsguru.com/nba/team-power-rankings.php';
  return axios
    .get(source)
    .then(({data}) => data as string)
    .then(cheerio.load)
    .then((parser: CheerioAPI) =>
      parser(
        'table.rankings-table > tbody > tr > td:nth-child(2) > div.team-name-v2 > span.abbrv'
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

/**
 * @returns true if there are games present that are not preseason games (i.e. weekNumber > 0)
 */
function containsValidGames({games}: RawNBAGamesOnDate): boolean {
  return games.find(game => game.weekNumber > 0) !== undefined;
}

function containsGamesWithinRange(
  min: DateTime,
  max: DateTime,
  {gameDate}: RawNBAGamesOnDate
): boolean {
  const date = DateTime.fromFormat(gameDate, 'M/d/yyyy h:mm:ss a', {zone: 'America/New_York'});
  return date.isValid && min <= date && date <= max;
}

function aWeekAgo() {
  return DateTime.now()
    .setZone('America/New_York')
    .startOf('day')
    .minus({week: 1});
}

function aWeekFromNow() {
  return DateTime.now()
    .setZone('America/New_York')
    .startOf('day')
    .plus({week: 1});
}

function getNBASchedule(
  min: DateTime = aWeekAgo(),
  max: DateTime = aWeekFromNow()
): Promise<RawNBAGamesOnDate[]> {
  const isWithinWeek = containsGamesWithinRange.bind(null, min, max);
  const SCHEDULE_URL = 'https://cdn.nba.com/static/json/staticData/scheduleLeagueV2_1.json';
  return axios
    .get(SCHEDULE_URL)
    .then(({data}) => data as RawNBASchedule)
    .then(({leagueSchedule: {gameDates}}) => gameDates.filter(containsValidGames).filter(isWithinWeek)
    );
}

function parseNBAStandings({resultSets}: RawNBAStandings): ParsedNBAStandings {
  const rawStandings = resultSets.find(r => r.name === 'Standings');
  if (rawStandings === undefined) {
    throw new Error('Could not parse NBA standings.');
  }
  return rawStandings.rowSet.reduce((standings, rawTeam) => {
    const parsedTeam: ParsedNBAStandingEntry = rawStandings.headers.reduce((team, header, currentIndex) => {
      team[header] = rawTeam[currentIndex];
      return team;
    }, {} as ParsedNBAStandingEntry);
    return [...standings, parsedTeam];
  }, [] as ParsedNBAStandings);
}

function getNBAStandings(): Promise<ParsedNBAStandings> {
  const STANDINGS_URL =
    'https://stats.nba.com/stats/leaguestandingsv3' +
    `?GroupBy=conf&LeagueID=${LEAGUE_ID}&Season=${SEASON}&SeasonType=Regular+Season&Section=overall`;
  return axios.get(STANDINGS_URL, {headers: HEADERS})
    .then(({data}) => data as RawNBAStandings).then(parseNBAStandings);
}

export default {
  getRankings,
  getNBASchedule,
  getNBAStandings
};
