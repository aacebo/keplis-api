import { Response, NextFunction } from 'express';

import { IAuthRequest } from '../auth';

import Logger from './logger';

export function logger(req: IAuthRequest, res: Response, next: NextFunction) {
  const start = new Date();

  res.once('finish', () => {
    const end = new Date();
    const elapse = end.getTime() - start.getTime();
    const msg = `${req.method}(${res.statusCode}), ${req.originalUrl}, ${elapse}ms, ${req.user?.email || 'anonymous'}`;

    if (res.statusCode >= 200 && res.statusCode < 400) {
      Logger.info(msg);
    } else if (res.statusCode >= 400 && res.statusCode < 500) {
      Logger.warn(msg);
    } else {
      Logger.error(msg);
    }
  });

  next();
}
