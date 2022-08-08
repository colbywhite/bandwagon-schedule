import type {Game, Schedule, TeamRecord} from './types';
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

export default function getSchedule(): Schedule {
  const reduceFunc = (schedule: Schedule, date: DateTime) => {
    return {...schedule, [date.toISODate()]: buildGames(date)};
  };
  return indexArray(3)
    .map(index => augSeventh.plus({days: index}))
    .reduce(reduceFunc, {} as Schedule)
    ;
}
