import {Handler} from '@netlify/functions';

const handler: Handler = async () =>
  fetch('https://www.basketball-reference.com/leagues/NBA_2023_standings.html')
    .then(() => ({statusCode: 200, body: JSON.stringify({message: 'Can hit basketball-reference.com'})}))
    .catch(() => ({statusCode: 500, body: JSON.stringify({message: 'Can not hit basketball-reference.com'})}));

export {handler};
