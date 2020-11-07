import 'reflect-metadata';

import { startServer } from './server';

import Logger from './core/logger';

startServer().then(app => {
  const port = +process.env.PORT || 3000;

  app.listen(port, () => Logger.info(`listening on port ${port}...`));
}).catch(() => {
  Logger.error('an error occurred during startup');
});
