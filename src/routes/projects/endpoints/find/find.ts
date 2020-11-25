import { MongooseFilterQuery } from 'mongoose';
import { Response } from 'express';

import { IPaginationRequest } from '../../../../core/pagination';

import { ProjectModel, IProjectDocument, Project } from '../../project.entity';

export async function find(req: IPaginationRequest, res: Response) {
  const conditions: MongooseFilterQuery<Pick<IProjectDocument, keyof IProjectDocument>> = {
    name: { $regex: req.pagination.filter, $options: 'i' },
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
