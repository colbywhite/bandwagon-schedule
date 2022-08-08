import type {Schedule} from './types';
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
const schedule: Schedule = {
  games: Array.from(Array(7).keys())
    .map(index => ({
      id: index,
      home: teams[index % teams.length],
      away: teams[(index + 1) % teams.length],
      network: networks[index % networks.length],
      gameTime: augSeventh.plus({day: index}).toJSDate()
    }))
};

export default function getSchedule(): Schedule {
  return schedule;
}
