import type {GetStaticProps, NextPage} from 'next';
import Header from '../components/header';
import Footer from '../components/footer';
import type {Schedule} from './lib/types';
import getSchedule from './lib/schedule';
import GameCard from '../components/gameCard';

const Home: NextPage<Schedule> = ({games}) => {
  return (
    <div className="w-full flex flex-col justify-around gap-1.5 p-2 md:p-3 lg:p-4">
      <Header/>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 justify-between">
        {games.map(game => (<GameCard game={game} key={game.id}/>))}
      </main>
      <Footer/>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<Schedule> = async (context) => {
  return {
    props: getSchedule()
  };
};
