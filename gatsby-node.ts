import type {GatsbyNode} from 'gatsby';
import {resolve} from 'path';
import getSoccerSchedule from './src/lib/ingest/soccer';
import {DateTime} from 'luxon';
import type {SerializedScheduleResponse} from './src/lib/serialize';
import {serialize} from './src/lib/serialize';

export type SerializedIndexPageContext = { schedule: SerializedScheduleResponse }

export const createPages: GatsbyNode['createPages'] = async ({actions: {createPage}}) => {
  const startOfDay = DateTime.now().setZone('America/New_York').startOf('day');
  const schedule = await getSoccerSchedule(startOfDay, startOfDay.plus({week: 1}));
  createPage<SerializedIndexPageContext>({
    path: '/',
    component: resolve('src/templates/index.tsx'),
    context: {schedule: serialize({...schedule, buildTime: new Date()})}
  });
};
