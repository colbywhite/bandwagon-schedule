import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";

export const meta: MetaFunction = () => {
  return {
    title: "New Remix App",
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
  };
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    {
      rel: "preload",
      as: "image",
      href: "https://raw.githubusercontent.com/jacob-ebey/remix-ecommerce/main/app/images/remix-glow.svg",
    },
  ];
};

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
