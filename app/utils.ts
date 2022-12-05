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

export function useTimezone() {
  const indexRouteData = useMatchesData<{ zone: string }>("routes/index");
  if (indexRouteData === undefined) {
    throw new Error("No route data found for 'routes/index'");
  }
  return indexRouteData.zone;
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
