import { DateTime } from "luxon";
import React from "react";
import { useTimezone } from "~/utils";

export interface TimeProps {
  time: DateTime | Date | string;
  formatter: DateFormatter | string;
  zone?: string;
}

export type DateFormatter = (date: DateTime, zone: string) => string;

function buildStandardFormatter(format: string): DateFormatter {
  return (date, zone: string) => date.setZone(zone).toFormat(format);
}

function isString(val: unknown): val is string {
  return typeof val === "string";
}

export default function Time({
  time,
  formatter: givenFormatter,
  zone: givenZone,
}: TimeProps) {
  const zone = givenZone || useTimezone();
  const formatter = isString(givenFormatter)
    ? buildStandardFormatter(givenFormatter)
    : givenFormatter;
  const dateTime = isString(time)
    ? DateTime.fromISO(time)
    : DateTime.isDateTime(time)
    ? time
    : DateTime.fromJSDate(time);
  return <time dateTime={dateTime.toISO()}>{formatter(dateTime, zone)}</time>;
}
