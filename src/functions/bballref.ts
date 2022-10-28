export default () =>
  fetch('https://www.basketball-reference.com/leagues/NBA_2023_standings.html')
    .then(() => new Response('Can hit basketball-reference.com'))
    .catch(() => new Response('Can not hit basketball-reference.com'))
