import type {Logger, PluginOption} from 'vite';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import getSoccerGames from './src/lib/ingest/soccer';
import {DateTime} from 'luxon';
import {VitePWA} from 'vite-plugin-pwa';
import {fullScheduleFromGames} from './src/lib/ingest';
import type {Game} from './@types';


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
      const filepath = './src/data.json';
      const schedule = await getGames(getSoccerGames, 'soccer').then(fullScheduleFromGames);
      await fs.writeFileSync(filepath, JSON.stringify(schedule, null, 2));
      log(`Ingested games to ${filepath}`);
    }
  });
};


const buildVersion = () => {
  return DateTime.now().setZone('America/Chicago').toFormat('yy.M.d.H.m.s');
};

// https://vitejs.dev/config/
export default defineConfig({
  define: {__APP_VERSION__: JSON.stringify(buildVersion())},
  plugins: [
    react(),
    ingest(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        sourcemap: true
      }
    })
  ]
});
