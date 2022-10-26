import {DateTime} from 'luxon';
import React from 'react';
import type {DateFormatter} from './time';
import Time from './time';
import logo from '../images/vite.svg';
import type {Game, Team, TeamRecord} from '../../@types';
import TeamLogo from './teamLogo';

interface GameProps {
  game: Game;
}

interface TeamProps {
  team: Team;
}

interface RecordProps {
  record?: TeamRecord;
}

interface RankProps {
  rank?: number;
}

interface NetworkProps {
  network?: string;
}

function Record({record}: RecordProps) {
  const recordToString = (record: TeamRecord) =>
    record.ties
      ? `${record.wins}-${record.losses}-${record.ties}`
      : `${record.wins}-${record.losses}`;
  return record ? (
    <p>
      {recordToString(record)}, {record.conferenceRank} in {record.conference}
    </p>
  ) : (
    <></>
  );
}

function Rank({rank}: RankProps) {
  return rank ? <p>Power Rank: {rank}</p> : <></>;
}

function NetworkLogo({network}: NetworkProps) {
  return network ? (
    <div className="h-fit max-h-[50px] w-fit max-w-[50px]">
      <img
        src={logo}
        alt={`${network} logo`}
      />
    </div>
  ) : (
    <></>
  );
}

function TeamInfo({team}: TeamProps) {
  return (
    <div className="flex flex-row items-center gap-4">
      <TeamLogo team={team}/>
      <div className="flex flex-col gap-0">
        <h5 className="mb-1">{team.shortName}</h5>
        <Record record={team.record}></Record>
        <Rank rank={team.powerRank}></Rank>
      </div>
    </div>
  );
}

const gameTimeFormatter: DateFormatter = (date) => {
  const dateTime = DateTime.fromJSDate(date).setZone('local');
  const timeZone = dateTime.toFormat('ZZZZZ').split(' ')[0];
  return dateTime.toFormat(`h:mm a '${timeZone}'`);
};

export default function GameCard({game}: GameProps) {
  return (
    <div className="border-400 flex flex-col gap-3 border-2 p-1">
      <div className="flex flex-row items-center justify-around gap-1">
        <div className="border-r-400 flex grow flex-col gap-1 border-r-2">
          <TeamInfo team={game.away}/>
          <TeamInfo team={game.home}/>
        </div>
        <div className="flex basis-1/4 flex-col items-center gap-1 text-center">
          <NetworkLogo network={game.network}></NetworkLogo>
          <Time time={new Date(game.gameTime)} formatter={gameTimeFormatter}></Time>
        </div>
      </div>
      <div className="text-center">
        <p>{game.competition}</p>
        <p>
          {game.venue.name}, {game.venue.city}
        </p>
      </div>
    </div>
  );
}
