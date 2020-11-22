import { MongooseFilterQuery } from 'mongoose';
import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IPaginationRequest } from '../../../../core/pagination';
import { OrganizationModel } from '../../../organizations/organization.entity';

import { ProjectModel, IProjectDocument, Project } from '../../project.entity';

export async function find(req: IPaginationRequest, res: Response) {
  const organization = await OrganizationModel.findOne({ name: req.params.orgName });

  if (!organization) {
    res.status(StatusCodes.NOT_FOUND).send(`Organization ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const conditions: MongooseFilterQuery<Pick<IProjectDocument, keyof IProjectDocument>> = {
    name: { $regex: req.pagination.filter, $options: 'i' },
    organization: organization._id,
    removedAt: { $eq: undefined },
  };

  const [projects, total] = await Promise.all([
    ProjectModel.find(conditions)
      .sort(req.pagination.sort.join(' '))
      .skip(req.pagination.skip)
      .limit(req.pagination.perPage)
      .populate('createdBy', '_id image username email'),
    ProjectModel.countDocuments(conditions),
  ]);

  req.total = total;
  res.send(projects.map(p => p.toObject()).map((p: Project) => ({
    ...p,
    tickets: p.tickets.length,
  })));
}
