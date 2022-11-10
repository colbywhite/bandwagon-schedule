import { DateTime } from "luxon";
import React from "react";

export interface TimeProps {
  time: Date;
  formatter: DateFormatter | string;
}

export type DateFormatter = (date: Date) => string;

function buildStandardFormatter(format: string): DateFormatter {
  return (date) =>
    DateTime.fromJSDate(date).setZone("America/New_York").toFormat(format);
}

function isString(val: unknown): val is string {
  return typeof val === "string";
}

export default function Time({ time, formatter: givenFormatter }: TimeProps) {
  const formatter = isString(givenFormatter)
    ? buildStandardFormatter(givenFormatter)
    : givenFormatter;
  return <time dateTime={time.toISOString()}>{formatter(time)}</time>;
}
