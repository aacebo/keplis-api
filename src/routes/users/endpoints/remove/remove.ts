import { Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';

import { UserModel } from '../../user.entity';

export async function remove(req: IAuthRequest, res: Response) {
  const user = await UserModel.findById(req.params.userId);

  if (!user) {
    res.status(StatusCodes.NOT_FOUND).send(`User ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  if (user._id !== req.user.id) {
    res.status(StatusCodes.UNAUTHORIZED).send('Can\'t Remove Another User');
    return;
  }

  user.removedAt = new Date();
  await user.save();

  res.send(user.toObject());
}
