export default function Header({ version }: { version?: string }) {
  return (
    <header className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-4">
        <img
          src="https://raw.githubusercontent.com/jacob-ebey/remix-ecommerce/main/app/images/remix-glow.svg"
          className="pointer-events-none h-10"
          alt="logo"
        />
        <h6 className="text-xl font-medium">Power schedules</h6>
      </div>
      {version && <p>Version: {version}</p>}
    </header>
  );
}
