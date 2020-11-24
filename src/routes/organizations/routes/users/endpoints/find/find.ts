import { MongooseFilterQuery } from 'mongoose';
import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IPaginationRequest } from '../../../../../../core/pagination';
import { IAuthRequest } from '../../../../../../core/auth';

import { UserModel } from '../../../../../users/user.entity';

import { OrganizationModel, IOrganizationDocument, Organization } from '../../../../organization.entity';

export async function find(req: IAuthRequest & IPaginationRequest, res: Response) {
  const user = await UserModel.findOne({ username: req.params.username });

  if (!user) {
    res.status(StatusCodes.NOT_FOUND).send(`User ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const conditions: MongooseFilterQuery<Pick<IOrganizationDocument, keyof IOrganizationDocument>> = {
    owners: { $in: [user._id] },
    displayName: { $regex: req.pagination.filter, $options: 'i' },
    removedAt: { $eq: undefined },
  };

  const [organizations, total] = await Promise.all([
    OrganizationModel.find(conditions)
      .sort(req.pagination.sort.join(' '))
      .skip(req.pagination.skip)
      .limit(req.pagination.perPage)
      .populate('createdBy', '_id image username email'),
    OrganizationModel.countDocuments(conditions),
  ]);

  req.total = total;
  res.send(organizations.map(o => o.toObject()).map((o: Organization) => ({
    ...o,
    owners: o.owners.length,
    projects: o.projects.length,
  })));
}
