import type {Logger, PluginOption} from 'vite';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import getSoccerGames from './src/lib/ingest/soccer';
import {DateTime} from 'luxon';
import {VitePWA} from 'vite-plugin-pwa';

const ingest: () => PluginOption = () => {
  let logger: Logger;
  const log = (msg) => {
    if (logger) {
      logger.info(msg, {timestamp: true});
    } else {
      console.log(msg);
    }
  };
  return ({
    name: 'schedule.ingest',
    configResolved: resolvedConfig => logger = resolvedConfig.logger,
    buildStart: async () => {
      const filepath = './src/data.json';
      const today = DateTime.now()
        .setZone('America/New_York')
        .startOf('day');
      const schedule = await getSoccerGames(today);
      await fs.writeFileSync(filepath, JSON.stringify(schedule));
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
