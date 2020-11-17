import { MongooseFilterQuery } from 'mongoose';
import { Response } from 'express';

import { IPaginationRequest } from '../../../../core/pagination';
import { IAuthRequest } from '../../../../core/auth';
import { UserModel, IUserDocument } from '../../user.entity';

export async function find(req: IAuthRequest & IPaginationRequest, res: Response) {
  const conditions: MongooseFilterQuery<Pick<IUserDocument, keyof IUserDocument>> = {
    $or: [
      { username: { $regex: req.pagination.filter, $options: 'i' } },
      { email: { $regex: req.pagination.filter, $options: 'i' } },
    ],
    removedAt: { $eq: undefined },
  };

  const [users, total] = await Promise.all([
    UserModel.find(conditions)
      .sort(req.pagination.sort.join(' '))
      .skip(req.pagination.skip)
      .limit(req.pagination.perPage),
    UserModel.countDocuments(conditions),
  ]);

  req.total = total;
  res.send(users.map(u => u.toObject()));
}
