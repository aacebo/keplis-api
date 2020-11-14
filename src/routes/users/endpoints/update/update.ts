import { Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';

import { UserModel } from '../../user.entity';

import { UpdateUserRequest } from './update-request.dto';

export async function update(req: IAuthRequest<any, any, UpdateUserRequest>, res: Response) {
  let user = await UserModel.findOne({ username: req.params.username });

  if (!user) {
    res.status(StatusCodes.NOT_FOUND).send(`User ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  if (user._id !== req.user.id) {
    res.status(StatusCodes.UNAUTHORIZED).send('Can\'t Update Another User');
    return;
  }

  user = Object.assign(user, req.body);
  await user.save();

  res.send(user.toObject());
}
