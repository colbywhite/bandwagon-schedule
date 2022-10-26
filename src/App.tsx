import {gamesByDate} from './data.json';
import type {Game} from '../@types';
import SingleDaySchedule from './components/singleDaySchedule';
import {DateTime} from 'luxon';
import Header from './components/header';

function App() {
  // TODO better handle serialization and enum
  const games: Record<string, Game[]> = gamesByDate as Record<string, any[]>;
  return (
    <div className="flex w-full flex-col justify-around gap-1.5 p-2 focus-visible:outline-none md:p-3 lg:p-4">
      <Header/>
      <main className="my-3 flex flex-col gap-2 motion-safe:animate-fade-in">
        {Object.keys(gamesByDate)
          .map((date) => ({date, games: games[date]}))
          .map(({date, games}) => (<SingleDaySchedule
              date={DateTime.fromISO(date).setZone('America/New_York')}
              games={games as Game[]}
              key={date}
            />)
          )}
      </main>
    </div>);
}


export default App;
