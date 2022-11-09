import type { Team } from "~/@types";

export type LogoProps = { team: Team; width?: number; height?: number };
const DEFAULT_PROPS = { width: 50, height: 50 } as const;
export default function TeamLogo({ team, ...props }: LogoProps) {
  const { width, height } = { ...DEFAULT_PROPS, ...props };
  return (
    <img
      src="https://raw.githubusercontent.com/jacob-ebey/remix-ecommerce/main/app/images/remix-glow.svg"
      alt={team.fullName}
      loading="lazy"
      width={width}
      height={height}
    />
  );
}
