import { useMemo } from "react";
import { useMatches } from "@remix-run/react";
import { DateTime } from "luxon";
import type { RouteData } from "@remix-run/react/dist/routeData";
import ipRegex from "ip-regex";

export function useMatchesData<T extends RouteData>(id: string) {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route ? (route.data as T) : undefined;
}

export function useRootData() {
  const indexRouteData = useMatchesData<{
    zone: string;
    version: string | undefined;
    buildTime: number;
  }>("root");
  if (indexRouteData === undefined) {
    throw new Error("No route data found for 'routes/index'");
  }
  return indexRouteData;
}

export function useTimezone() {
  const { zone } = useRootData();
  return zone;
}

const DEFAULT_TZ = "America/New_York";

interface IpLocateResponse {
  asn: string | null;
  city: string | null;
  continent: string | null;
  country: string | null;
  country_code: string | null;
  ip: string | null;
  org: string | null;
  latitude: number | null;
  longitude: number | null;
  postal_code: string | null;
  subdivision: string | null;
  time_zone: string | null;
}

const headerNames = Object.freeze([
  "X-NF-Client-Connection-IP",
  "Client-IP",
  "X-Client-IP",
  "X-Forwarded-For",
] as const);

/**
 * This is inspired by remix-utils but is tweaked to prioritize the headers I need prioritized and to reduce dependencies.
 * @see https://github.com/sergiodxa/remix-utils/blob/v4.3.0/src/server/get-client-ip-address.ts
 */
function getClientIPAddress({ headers }: Request) {
  const ipAddress = headerNames
    .flatMap((headerName) => {
      const value = headers.get(headerName);
      return !value?.includes(", ") ? value : value.split(", ");
    })
    .find((ip) => ip !== null && ipRegex({ exact: true }).test(ip));
  return ipAddress ?? null;
}

// TODO pull IP from cookie if present
export async function getTimeZone(request: Request) {
  const ip = getClientIPAddress(request);
  const fallbackTZ =
    process.env.NODE_ENV === "production" ? DEFAULT_TZ : "America/Chicago";
  // TODO use regex to check if ip address
  if (isDefinedString(ip)) {
    return fetchJson<IpLocateResponse>(
      `https://www.iplocate.io/api/lookup/${ip}`
    )
      .then(({ time_zone }) => (time_zone === null ? fallbackTZ : time_zone))
      .catch(() => fallbackTZ);
  }
  return Promise.resolve(fallbackTZ);
}

function isDefinedString(val: unknown): val is string {
  return (
    val !== undefined && val !== null && typeof val === "string" && val !== ""
  );
}

async function fetchJson<T>(...args: Parameters<typeof fetch>) {
  return fetch(...args).then((res) => res.json() as Promise<T>);
}

export function today() {
  return DateTime.now().setZone("America/New_York").startOf("day");
}

export function toDateTime(val: string | Date): DateTime {
  return typeof val === "string"
    ? DateTime.fromISO(val)
    : DateTime.fromJSDate(val);
}

/**
 * The next rebuild is defined as 10 am UTC the following day of the given time.
 * This is when most US games should be finished, thus meaning we should rebuild the schedule.
 * @returns the amount of seconds between the given time and the next time we should rebuild the site.
 * @param msSinceEpoch An integer/string value representing the number of milliseconds since the UNIX epoch.
 */
export function secondsUntilNextRebuild(msSinceEpoch?: string | number) {
  const ONE_HOUR_IN_MS = 60 * 60 * 1000;
  const date = msSinceEpoch ? new Date(Number(msSinceEpoch)) : new Date();
  const truncatedDate = truncateMS(date);
  const startOfTomorrowInEpoch =
    copyDate(truncatedDate).setUTCHours(23, 59, 59, 999) + 1;
  const expirationDate = new Date(startOfTomorrowInEpoch + 10 * ONE_HOUR_IN_MS);
  return Math.floor(
    (expirationDate.getTime() - truncatedDate.getTime()) / 1000
  );
}

function truncateMS(date: Date) {
  return new Date(copyDate(date).setUTCMilliseconds(0));
}

function copyDate(date: Date) {
  return new Date(date.getTime());
}
