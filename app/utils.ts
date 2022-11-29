import { useMemo } from "react";
import { useMatches } from "@remix-run/react";
import { DateTime } from "luxon";
import type { RouteData } from "@remix-run/react/dist/routeData";

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
  asn: string;
  city: string;
  continent: string;
  country: string;
  country_code: string;
  ip: string;
  org: string;
  latitude: number;
  longitude: number;
  postal_code: string;
  subdivision: string;
  time_zone: string;
}

// TODO pull IP from cookie if present
export async function getTimeZone(ip: unknown) {
  const fallbackTZ =
    process.env.NODE_ENV === "production" ? DEFAULT_TZ : "America/Chicago";
  // TODO use regex to check if ip address
  if (isDefinedString(ip)) {
    return fetchJson<IpLocateResponse>(
      `https://www.iplocate.io/api/lookup/${ip}`
    )
      .then(({ time_zone }) => time_zone)
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
