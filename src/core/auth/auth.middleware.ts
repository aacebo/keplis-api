import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';

import { IUserDocument, UserModel } from '../../routes/users/user.entity';
import { Cache } from '../cache';

import { IAuthRequest } from './auth-request.interface';
import { IAuthPayload } from './auth-payload.interface';

const cache = new Cache<IUserDocument>({ maxAge: 300000, maxKeys: 1000 });

export async function auth(req: IAuthRequest, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const payload = token ? jwt.verify(token, process.env.SECRET) as IAuthPayload : undefined;

  if (!payload) {
    res.status(StatusCodes.UNAUTHORIZED).send('Invalid Token');
    return;
  }

  if (!cache.has(payload.id)) {
    const user = await UserModel.findById(payload.id);

    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).send('Token User Not Found');
      return;
    }

    cache.set(user._id, user);
  }

  delete payload.iat;
  req.user = payload;
  next();
}
