import {Handler} from '@netlify/functions';

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
const URL = 'https://stats.nba.com/stats/leaguestandingsv3?GroupBy=conf&LeagueID=00&Season=2022-23&SeasonType=Regular+Season&Section=overall';

const handler: Handler = async () =>
  fetch(URL, {headers: HEADERS})
    .then(() => ({statusCode: 200, body: JSON.stringify({message:'Can hit nba.com'})}))
    .catch(() => ({statusCode: 500, body: JSON.stringify({message:'Can not hit nba.com'})}));

export {handler};
