import type {Schedule} from './types';
import teams from './basketballTeams';

const networks = [
  'ABC',
  'ESPN',
  'NBATV',
  'TNT'
];

const schedule: Schedule = {
  games: Array.from(Array(7).keys())
    .map(index => ({
      id: index,
      home: teams[index % teams.length],
      away: teams[(index + 1) % teams.length],
      network: networks[index % networks.length]
    }))
};

export default function getSchedule(): Schedule {
  return schedule;
}
