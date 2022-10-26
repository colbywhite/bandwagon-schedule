import logo from '../images/vite.svg';
import React from 'react';
import Time from './time';

type HeaderProps = { buildTime?: Date }
export default function Header({buildTime}: HeaderProps) {
  return (
    <header className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-4">
        <img src={logo} className="h-10 pointer-events-none" alt="logo"/>
        <h6 className="text-xl font-medium">Power schedules</h6>
      </div>
      {buildTime && <p>Build time: <Time time={buildTime} formatter="LLL d h:mm a ZZZZ" /></p>}
    </header>
  );
}
