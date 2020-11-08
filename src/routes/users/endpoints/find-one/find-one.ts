import { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { UserModel } from '../../user.entity';

export async function findOne(req: Request, res: Response) {
  const user = await UserModel.findOne({ username: req.params.username });

  if (!user) {
    res.status(StatusCodes.NOT_FOUND).send(`User ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  res.send(user.toObject());
}
