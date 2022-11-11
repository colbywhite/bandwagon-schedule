import type { Team } from "~/@types";
import { Sport } from "~/@types";

export type LogoProps = { team: Team; width?: number; height?: number };
const DEFAULT_PROPS = { width: 50, height: 50 } as const;
export default function TeamLogo({ team, ...props }: LogoProps) {
  if (!team || !team.logoUrl) {
    return <></>;
  }
  const {width, height} = {...DEFAULT_PROPS, ...props};
  if (team.sport === Sport.soccer) {
    const format = `w_${width},h_${height}`;
    return (
      <img
        src={team.logoUrl.replace(/\{formatInstructions\}/, format)}
        alt={team.fullName}
        loading="lazy"
        width={width}
        height={height}
      />
    );
  } else if (team.sport === Sport.basketball) {
    return (
      <img
        src={team.logoUrl}
        alt={team.fullName}
        loading="lazy"
        width={width}
        height={height}
      />
    );
  }
  return <></>;
}
