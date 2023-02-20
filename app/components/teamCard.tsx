import type { Team, TeamRecord } from "~/@types";
import TeamLogo from "./teamLogo";

export function TeamCard({ team }: { team: Team }) {
  const recordToString = (record: TeamRecord) =>
    record.ties
      ? `${record.wins}-${record.losses}-${record.ties}`
      : `${record.wins}-${record.losses}`;
  return (
    <div className="team-card">
      <figure>
        <TeamLogo team={team} />
      </figure>
      <div className="card-body">
        <h5 className="card-title">{team.shortName}</h5>
        {team.powerRank && <p>Power Rank: {team.powerRank}</p>}
        {team.record && (
          <p>
            {recordToString(team.record)}, {team.record.conferenceRank} in{" "}
            {team.record.conference}
          </p>
        )}
      </div>
    </div>
  );
}
