import {DateTime} from 'luxon';
import Header from 'src/components/header';
import SingleDaySchedule from 'src/components/singleDaySchedule';
import Footer from 'src/components/footer';
import {useEffect, useState} from 'react';
import type {Schedule} from 'types/index';
import superjson from 'superjson';

const HomePage = () => {
  const [schedule, setSchedule] = useState({} as Schedule)
  useEffect(() => {
    fetch('/.redwood/functions/schedule')
      .then(response => response.text() as Promise<string>)
      .then(body => superjson.parse<Schedule>(body))
      .then(setSchedule)
  }, [])
  return (
    <div className="w-full flex flex-col justify-around gap-1.5 p-2 md:p-3 lg:p-4">
      <Header/>
      <main className="flex flex-col gap-2 my-3">
        {Object.keys(schedule)
          .map(dateString => [DateTime.fromISO(dateString), schedule[dateString]] as const)
          .map(([date, games]) => (
            <SingleDaySchedule date={date} games={games} key={date.toISODate()}/>
          ))
        }
      </main>
      <Footer/>
    </div>
  );
};

export default HomePage;
