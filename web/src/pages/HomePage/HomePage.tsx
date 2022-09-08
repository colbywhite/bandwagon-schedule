import Footer from "src/components/footer";
import Header from "src/components/header";
import ScheduleCell from "src/components/ScheduleCell";

const HomePage = () => {
  return (
    <div className="flex w-full flex-col justify-around gap-1.5 p-2 focus-visible:outline-none md:p-3 lg:p-4">
      <Header />
      <main className="my-3 flex flex-col gap-2">
        <ScheduleCell />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
