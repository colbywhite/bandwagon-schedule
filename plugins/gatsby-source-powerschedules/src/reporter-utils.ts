import type {Reporter} from 'gatsby';

const sourceNodesActivityName = 'powerschedules';

enum STATUSES {
  InProgress = 'Fetching games',
  Done = 'Fetched games'
}

export const getTimer = (reporter: Reporter, name: string) => {
  const timer = reporter.activityTimer(`${sourceNodesActivityName}.${name}`);
  timer.start();
  timer.setStatus(STATUSES.InProgress);
  return {
    end: () => {
      timer.setStatus(STATUSES.Done);
      timer.end();
    }
  };
};
