import type { Team } from "~/@types";

function BasketballLogo({ src, alt }: { src: string; alt: string }) {
  return <img loading="lazy" src={src} alt={alt} width={48} height={48} />;
}

function SoccerLogo({ src, alt }: { src: string; alt: string }) {
  const format = "w_48,h_48";
  return (
    <img
      src={src.replace(/\{formatInstructions\}/, format)}
      alt={alt}
      width={48}
      height={48}
      loading="lazy"
    />
  );
}

export default function TeamLogo({
  team: { fullName, logoUrl, sport },
}: {
  team: Team;
}) {
  if (logoUrl === undefined) {
    return <></>;
  } else if (sport === "soccer") {
    return <SoccerLogo src={logoUrl} alt={fullName} />;
  } else {
    return <BasketballLogo src={logoUrl} alt={fullName} />;
  }
}
