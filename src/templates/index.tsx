import React from 'react';
import Header from '../components/header';
import type {HeadFC} from 'gatsby';
import type {SerializedIndexPageContext} from '../../gatsby-node';
import {DateTime} from 'luxon';
import SingleDaySchedule from '../components/singleDaySchedule';
import {deserialize} from '../lib/serialize';

type PreRenderedPageProps<T> = { pageContext: T }

function formatBuildTime(date: Date) {
  const dateTime = DateTime.fromJSDate(date).setZone();
  const timeZone = dateTime.toFormat('ZZZZZ').split(' ')[0];
  return dateTime.toFormat(`LLL d h:mm a '${timeZone}'`);
}

export default function Index({pageContext: {schedule}}: PreRenderedPageProps<SerializedIndexPageContext>) {
  const {gamesByDate, buildTime} = deserialize(schedule);
  return (
    <div className="flex w-full flex-col justify-around gap-1.5 p-2 focus-visible:outline-none md:p-3 lg:p-4">
      <Header/>
      <main className="my-3 flex flex-col gap-2">
        <p>Build time: {formatBuildTime(buildTime)}</p>
        {Object.keys(gamesByDate).map((date) =>
          (
            <SingleDaySchedule
              date={DateTime.fromISO(date).setZone('America/New_York')}
              games={gamesByDate[date]}
              key={date}
            />
          ))}
      </main>
    </div>
  );
}
export const Head: HeadFC = () => <title>Power schedules</title>;
