import { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';

import { IAuthPayload } from '../../../../core/auth';
import { UserModel } from '../../user.entity';

import { LoginUserRequest } from './login-request.dto';

export async function login(req: Request<any, any, LoginUserRequest>, res: Response) {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    res.status(StatusCodes.NOT_FOUND).send(`User ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const token = jwt.sign({
    id: user._id,
    username: user.username,
    email: user.email,
  } as IAuthPayload, process.env.SECRET);

  res.send({
    token,
    user: user.toObject(),
  });
}
