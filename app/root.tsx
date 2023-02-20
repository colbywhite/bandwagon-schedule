import { json, LinksFunction, MetaFunction } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import Header from "~/components/header";
import Footer from "~/components/footer";
import { getTimeZone } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const zone = await getTimeZone(request);
  return json({ version: process.env.VERSION, zone });
}

export const meta: MetaFunction = () => {
  return {
    title: "Power schedules",
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
  };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export default function App() {
  const { version } = useLoaderData<typeof loader>();
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="mx-auto min-h-screen max-w-[65ch] p-2 md:max-w-[85ch]">
        <Header />
        <Outlet />
        <Footer version={version} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
