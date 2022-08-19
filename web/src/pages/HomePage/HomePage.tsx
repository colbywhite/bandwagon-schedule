import { useEffect, useState } from "react";

import { DateTime } from "luxon";
import superjson from "superjson";
import type { Schedule } from "types/index";

import Footer from "src/components/footer";
import Header from "src/components/header";
import SingleDaySchedule from "src/components/singleDaySchedule";

const HomePage = () => {
  const [schedule, setSchedule] = useState({} as Schedule);
  useEffect(() => {
    const abort = new AbortController();
    fetch("/.redwood/functions/schedule", { signal: abort.signal })
      .then((response) => response.text())
      .then((body) => superjson.parse<Schedule>(body))
      .then(setSchedule)
      .catch((error) => {
        if (error.name === "AbortError") return;
        throw error;
      });
    return () => abort.abort();
  }, []);
  return (
    <div className="flex w-full flex-col justify-around gap-1.5 p-2 md:p-3 lg:p-4">
      <Header />
      <main className="my-3 flex flex-col gap-2">
        {Object.keys(schedule)
          .map(
            (dateString) =>
              [DateTime.fromISO(dateString), schedule[dateString]] as const
          )
          .map(([date, games]) => (
            <SingleDaySchedule
              date={date}
              games={games}
              key={date.toISODate()}
            />
          ))}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
