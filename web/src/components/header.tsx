import { MetaTags } from "@redwoodjs/web";

export default function Header() {
  return (
    <header className="flex flex-row items-center justify-between">
      <MetaTags title="Redwood template" description="Home page" />
      <div className="flex flex-row items-center gap-4">
        <img src="/redwood.svg" className="h-10 pointer-events-none" alt="logo" />
        <h6>Power Schedules</h6>
      </div>
    </header>
  );
}
