import logo from '../images/vite.svg';
import React from 'react';
import Time from './time';

export default function Header() {
  return (
    <header className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-4">
        <img src={logo} className="h-10 pointer-events-none" alt="logo"/>
        <h6 className="text-xl font-medium">Power schedules</h6>
      </div>
      <p>Version: {__APP_VERSION__}</p>
    </header>
  );
}
