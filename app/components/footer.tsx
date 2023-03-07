import { GitHubLogoIcon } from "~/components/icons";
import Time from "~/components/time";

export default function Footer({
  version,
  buildTime,
}: {
  version?: string;
  buildTime?: Date;
}) {
  return (
    <footer className="footer w-full items-center border-t-2 border-primary pt-2">
      <div className="justify-self-center">
        <p className="prose-sm prose text-center">
          Built by
          <br />
          <a href="https://colbywhite.dev" className="link-secondary">
            Colby M. White
          </a>
        </p>
      </div>
      <div className="justify-self-center">
        <a href="https://github.com/colbywhite/powerschedules.net">
          <GitHubLogoIcon />
        </a>
      </div>
      {version && (
        <div className="justify-self-center">
          <p className="prose-sm prose text-center">
            Version <span className="font-bold">{version}</span>
            {buildTime && (
              <>
                <br />
                Built at{" "}
                <Time time={buildTime} formatter="LLL d, HH:mm:ss ZZZZ" />
              </>
            )}
          </p>
        </div>
      )}
    </footer>
  );
}
