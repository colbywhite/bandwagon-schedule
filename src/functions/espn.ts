export default () =>
  fetch('https://www.espn.com/nba/standings')
    .then(() => new Response('Can hit espn.com'))
    .catch(() => new Response('Can not hit espn.com'))
