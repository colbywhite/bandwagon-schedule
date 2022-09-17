import {DateTime} from 'luxon';
import React from 'react';
import useRenderer, {Renderer} from './renderer';
import {SwitchTransition, CSSTransition} from 'react-transition-group';

export interface TimeProps {
  time: Date;
  formatter: DateFormatter | string;
}

export type DateFormatter = (date: Date, zone: 'America/New_York' | 'local') => string;

function buildStandardFormatter(format: string): DateFormatter {
  return (date, zone) => DateTime.fromJSDate(date).setZone(zone).toFormat(format);
}

function isString(val: unknown): val is string {
  return typeof val === 'string'
}

export default function Time({time, formatter: givenFormatter}: TimeProps) {
  const {renderer} = useRenderer();
  const formatter = isString(givenFormatter) ? buildStandardFormatter(givenFormatter): givenFormatter
  const timeZone = renderer == Renderer.CLIENT ? 'local' : 'America/New_York';
  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={timeZone}
        addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}>
        <time className="transition-opacity" dateTime={time.toISOString()}>
          {formatter(time, timeZone)}
        </time>
      </CSSTransition>
    </SwitchTransition>
  );
}
