import {graphql, useStaticQuery} from 'gatsby';
import logo from '../images/icon.png';
import React from 'react';

const SITE_TITLE_QUERY = graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `;

export default function Header() {
  const {site} = useStaticQuery<Queries.Query>(SITE_TITLE_QUERY);
  return (
    <header className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-4">
        <img src={logo} className="motion-safe:animate-spin-slow h-10 pointer-events-none" alt="logo"/>
        <h6 className="text-xl font-medium">{site?.siteMetadata?.title}</h6>
      </div>
    </header>
  );
}
