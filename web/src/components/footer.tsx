export default function Footer() {
  return (
    <footer className="flex flex-row justify-between">
      <p>
        Created by{' '}
        <a href="https://github.com/colbywhite">Colby M. White</a>
      </p>
      <div className="h-5 w-5 pointer-events-none relative">
        <a href="https://github.com/colbywhite/powerschedules">
          <img src="/public/github.png" alt="GitHub logo"/>
        </a>
      </div>
    </footer>
  );
}
