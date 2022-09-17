import {graphql, useStaticQuery} from 'gatsby';
import logo from '../images/icon.png';
import React from 'react';
import Time from './time';

const SITE_TITLE_QUERY = graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `;

type HeaderProps = { buildTime?: Date }
export default function Header({buildTime}: HeaderProps) {
  const {site} = useStaticQuery<Queries.Query>(SITE_TITLE_QUERY);
  return (
    <header className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-4">
        <img src={logo} className="motion-safe:animate-spin-slow h-10 pointer-events-none" alt="logo"/>
        <h6 className="text-xl font-medium">{site?.siteMetadata?.title}</h6>
      </div>
      {buildTime && <p>Build time: <Time time={buildTime} formatter="LLL d h:mm a ZZZZ" /></p>}
    </header>
  );
}
