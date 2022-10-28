import {Handler} from '@netlify/functions';

const handler: Handler = async () =>
  fetch('https://www.espn.com/nba/standings')
    .then(() => ({statusCode: 200, body: JSON.stringify({message:'Can hit espn.com'})}))
    .catch(() => ({statusCode: 500, body: JSON.stringify({message:'Can not hit espn.com'})}));

export {handler};
