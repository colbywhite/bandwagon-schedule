import path from 'path';

import {DateTime} from 'luxon';
import type {Game, Team} from '../../../../@types';

import getOriginalSchedule from './';
import {setupTestsWithMockHelper} from '../../test.utils';

const gamesToIds = (games: Game[]) => games.map((g) => g.id);
// Auto set a wide time frame since that's not what we're testing here
const getSchedule = getOriginalSchedule.bind(
  null,
  DateTime.fromISO('2000-01-01'),
  DateTime.fromISO('2100-01-01')
);

describe('ingest/soccer', () => {
  const server = setupTestsWithMockHelper(path.join(__dirname, 'fixtures'));

  describe('Schedule#games', () => {
    it('should parse english, national tv networks', async () => {
      server.mockAll('scheduleWithDifferentNetworks.json');
      const {games} = await getSchedule();
      const [nationallyTelevisedGame, locallyTelevisedGame] = games;
      expect(nationallyTelevisedGame.network).toEqual('FS1');
      expect(locallyTelevisedGame.network).toBeUndefined();
    });

    it('should parse venue cities', async () => {
      server.mockAll('scheduleWithDifferentLocations.json');
      const {games} = await getSchedule();
      const locations = games.map((g) => g.venue);
      expect(locations).toEqual([
        {name: 'Estadio Nacional de Costa Rica', city: 'San Jose'},
        {name: 'Dick\'s Sporting Goods Park', city: 'Commerce City, CO'},
        {name: 'Exploria Stadium', city: 'Orlando, Florida'},
        {name: 'Allianz Field', city: 'Minnesota'}
      ]);
    });

    it('should parse competition name', async () => {
      server.mockAll('scheduleWithDifferentCompetitions.json');
      const {games} = await getSchedule();
      const competitions = games.map((g) => g.competition);
      expect(competitions).toEqual([
        'Concacaf Champions League',
        'MLS Regular Season',
        'US Open Cup',
        'Canadian Championship',
        'Campeones Cup'
      ]);
    });

    it('should parse teams in and not in the standings', async () => {
      server.mockAll('scheduleWithMlsVsNonMls.json');
      const {games} = await getSchedule();
      const game = games[0];
      const cin: Team = {
        id: 11504,
        abbreviation: 'CIN',
        fullName: 'FC Cincinnati',
        powerRank: 18,
        record: {
          conference: 'East',
          conferenceRank: 9,
          losses: 8,
          ties: 10,
          wins: 8
        },
        shortName: 'Cincinnati',
        sport: 'soccer'
      };
      const pit: Team = {
        id: 9908,
        abbreviation: 'PIT',
        fullName: 'Pittsburgh Riverhounds SC',
        shortName: 'Pittsburgh',
        sport: 'soccer'
      };
      expect(game.home).toEqual(cin);
      expect(game.away).toEqual(pit);
    });

    it('should parse game time', async () => {
      server.mockAll('scheduleWithGameOnApr19.json');
      const {games} = await getSchedule();
      const {gameTime} = games[0];
      expect(gameTime).toEqual(new Date('2022-04-19T23:00:00.0000000Z'));
    });
  });

  describe('Schedule#teams', () => {
    it('should parse teams', async () => {
      server.mockAll('scheduleWithRepeatTeams.json');
      const {teams} = await getSchedule();
      const names = teams.map((t) => t.shortName);
      expect(names).toEqual(['Santos', 'New York City']);
    });
  });

  describe('Schedule#gamesByDate', () => {
    it('should group games by Date', async () => {
      server.mockAll('scheduleFromApr19ToApr20.json');
      const {gamesByDate} = await getSchedule();
      const apr19games = gamesByDate['2022-04-19T00:00:00.000-04:00'];
      expect(gamesToIds(apr19games)).toEqual([
        '2022-04-19.pittsburgh-cincinnati.us-open-cup'
      ]);

      const apr20games = gamesByDate['2022-04-20T00:00:00.000-04:00'];
      expect(gamesToIds(apr20games)).toEqual([
        '2022-04-20.fc-motown-rny-fc.us-open-cup',
        '2022-04-20.charlotte-greenville.us-open-cup'
      ]);
    });
  });

  describe('Schedule#gamesByTeams', () => {
    it('should group by teams', async () => {
      server.mockAll('scheduleWithOneCommonTeam.json');
      const {gamesByTeam} = await getSchedule();
      const nycID = 9668;
      const torID = 2077;
      const sanID = 9722;
      const nycTorId = '2022-04-24.toronto-new-york-city.regular-season';
      const nycSanId = '2022-02-23.santos-new-york-city.ccl';
      expect(gamesToIds(gamesByTeam[nycID])).toEqual([nycTorId, nycSanId]);
      expect(gamesToIds(gamesByTeam[sanID])).toEqual([nycSanId]);
      expect(gamesToIds(gamesByTeam[torID])).toEqual([nycTorId]);
    });
  });
});
