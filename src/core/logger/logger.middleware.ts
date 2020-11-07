import { Response, NextFunction } from 'express';

import { IAuthRequest } from '../auth';

import Logger from './logger';

export function logger(req: IAuthRequest, res: Response, next: NextFunction) {
  const start = new Date();

  res.once('finish', () => {
    const end = new Date();
    const elapse = end.getTime() - start.getTime();

    Logger.info(`${req.method}, ${req.originalUrl}, ${elapse}ms, ${req.user?.email || 'anonymous'}`);
  });

  next();
}
