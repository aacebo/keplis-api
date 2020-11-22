import { MongooseFilterQuery } from 'mongoose';
import { Response } from 'express';

import { IPaginationRequest } from '../../../../core/pagination';
import { IAuthRequest } from '../../../../core/auth';

import { OrganizationModel, IOrganizationDocument, Organization } from '../../organization.entity';

export async function find(req: IAuthRequest & IPaginationRequest, res: Response) {
  const conditions: MongooseFilterQuery<Pick<IOrganizationDocument, keyof IOrganizationDocument>> = {
    name: { $regex: req.pagination.filter, $options: 'i' },
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
