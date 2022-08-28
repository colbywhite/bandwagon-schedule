export default function Footer() {
  return (
    <footer className="flex flex-row justify-between">
      <p>
        Created by <a href="https://github.com/colbywhite">Colby M. White</a>
      </p>
      <div className="pointer-events-none relative h-5 w-5">
        <a href="https://github.com/colbywhite/powerschedules">
          <img src="/github.png" alt="GitHub logo" />
        </a>
      </div>
    </footer>
  );
}
