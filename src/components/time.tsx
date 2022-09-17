import {DateTime} from 'luxon';
import React from 'react';
import useRenderer, {Renderer} from './renderer';
import {SwitchTransition, CSSTransition} from 'react-transition-group';

export interface TimeProps {
  time: Date;
}

function formatTime(date: Date, zone: 'America/New_York' | 'local') {
  const dateTime = DateTime.fromJSDate(date).setZone(zone);
  const timeZone = dateTime.toFormat('ZZZZZ').split(' ')[0];
  return dateTime.toFormat(`h:mm a '${timeZone}'`);
}

export default function Time({time}: TimeProps) {
  const {renderer} = useRenderer();
  const timeZone = renderer == Renderer.CLIENT ? 'local' : 'America/New_York';
  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={timeZone}
        addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
      >
        <time className="transition-opacity" dateTime={time.toISOString()}>
          {formatTime(time, timeZone)}
        </time>
      </CSSTransition>
    </SwitchTransition>
  );
}
