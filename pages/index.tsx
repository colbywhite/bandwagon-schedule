import type {GetStaticProps, InferGetStaticPropsType, NextPage} from 'next';
import Header from '../components/header';
import Footer from '../components/footer';
import type {Schedule} from './lib/types';
import getSchedule from './lib/schedule';
import {DateTime} from 'luxon';
import SingleDaySchedule from '../components/singleDaySchedule';

export const getStaticProps: GetStaticProps<{ schedule: Schedule }> = async () => ({
  props: {schedule: getSchedule()}
});

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({schedule}) => {
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

export default Home;

