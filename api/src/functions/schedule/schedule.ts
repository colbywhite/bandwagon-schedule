import type {APIGatewayEvent, Context} from 'aws-lambda';
import {logger} from 'src/lib/logger';
import superjson from 'superjson';
import type {Game, Schedule, TeamRecord} from 'types/index';
import teams from './basketballTeams';
import {DateTime} from 'luxon';

const newYorkZone = 'America/New_York';
const networks = [
  'ABC',
  'ESPN',
  'NBATV',
  'TNT'
];
const augSeventh = DateTime.fromISO('2022-08-07T19:00:00', {zone: newYorkZone});
const record: TeamRecord = {
  wins: 111,
  losses: 100,
  ties: 100,
  conference: 'East',
  conferenceRank: 100
};

function indexArray(count: number): number[] {
  return Array.from(Array(count).keys());
}

function buildGames(date: DateTime): Game[] {
  return indexArray(5)
    .map(index => ({
      id: index,
      home: {...teams[index % teams.length], record: record, powerRank: 100},
      away: {...teams[(index + 1) % teams.length], record: record, powerRank: 100},
      network: networks[index % networks.length],
      gameTime: date.set({hour: 18 + index}).toJSDate(),
      competitionDescription: 'NBA Regular Season',
      location: {
        arena: 'Madison Square Garden',
        city: 'New York',
        subdivision: 'NY'
      }
    }));
}

function getSchedule(): Schedule {
  const reduceFunc = (schedule: Schedule, date: DateTime) => {
    return {...schedule, [date.toISODate()]: buildGames(date)};
  };
  return indexArray(3)
    .map(index => augSeventh.plus({days: index}))
    .reduce(reduceFunc, {} as Schedule);
}


/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */
export const handler = async (event: APIGatewayEvent, context: Context) => {
  logger.info('Invoked schedule function');
  const schedule = await getSchedule();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: superjson.stringify(schedule)
  };
};
