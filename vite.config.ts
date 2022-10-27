import type {Logger, PluginOption} from 'vite';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import getBasketballGames from './src/lib/ingest/basketball';
import getSoccerGames from './src/lib/ingest/soccer';
import {DateTime} from 'luxon';
import {VitePWA} from 'vite-plugin-pwa';
import {fullScheduleFromGames} from './src/lib/ingest';
import {Game} from './@types';
import axios from 'axios';

const test = () => {
  return axios.get('https://www.basketball-reference.com/leagues/NBA_2023_standings.html')
    .then(() => console.log('Can hit basketball-reference.com'))
    .catch(() => console.error('Can not hit basketball-reference.com'))
}


const ingest: () => PluginOption = () => {
  let logger: Logger;
  const log = (msg) => {
    if (logger) {
      logger.info(msg, {timestamp: true});
    } else {
      console.log(msg);
    }
  };
  const getGames = async (fetcher: (min?: DateTime, max?: DateTime) => Promise<Game[]>, name: string) => {
    log(`Retrieving ${name} games`);
    const today = DateTime.now()
      .setZone('America/New_York')
      .startOf('day');
    const games = await fetcher(today);
    log(`Retrieved ${name} games`);
    return games;
  };
  return ({
    name: 'schedule.ingest',
    configResolved: resolvedConfig => logger = resolvedConfig.logger,
    buildStart: async () => {
      await test();
      const filepath = './src/data.json';
      const schedule = await Promise.all([getGames(getBasketballGames, 'basketball'), getGames(getSoccerGames, 'soccer')])
        .then(([bGames, sGames]) => [...bGames, ...sGames])
        .then(fullScheduleFromGames);
      await fs.writeFileSync(filepath, JSON.stringify(schedule, null, 2));
      log(`Ingested games to ${filepath}`);
    }
  });
};


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ingest(), VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true
    }
  })]
});
