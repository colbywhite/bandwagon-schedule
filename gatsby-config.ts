import type {GatsbyConfig} from 'gatsby';

const config: GatsbyConfig = {
  siteMetadata: {
    title: 'Power schedules',
    siteUrl: 'https://www.yourdomain.tld'
  },
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-postcss',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Power schedules',
        short_name: 'Power schedules',
        start_url: '/',
        icon: 'src/images/icon.png'
      }
    }]
};

export default config;
