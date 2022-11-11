import { useMemo } from "react";
import { useMatches } from "@remix-run/react";

export function useMatchesData(id: string) {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );

  return route?.data;
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
  // TODO use regex to check if ip address
  if (isDefinedString(ip)) {
    return fetchJson<IpLocateResponse>(
      `https://www.iplocate.io/api/lookup/${ip}`
    )
      .then(({ time_zone }) => time_zone)
      .catch(() => DEFAULT_TZ);
  }
  return Promise.resolve(DEFAULT_TZ);
}

function isDefinedString(val: unknown): val is string {
  return (
    val !== undefined && val !== null && typeof val === "string" && val !== ""
  );
}

async function fetchJson<T>(...args: Parameters<typeof fetch>) {
  return fetch(...args).then((res) => res.json() as Promise<T>);
}
