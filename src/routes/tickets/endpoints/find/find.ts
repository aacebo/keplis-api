import { MongooseFilterQuery } from 'mongoose';
import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IPaginationRequest } from '../../../../core/pagination';
import { OrganizationModel } from '../../../organizations/organization.entity';
import { ProjectModel } from '../../../projects/project.entity';

import { TicketModel, ITicketDocument } from '../../ticket.entity';

export async function find(req: IPaginationRequest, res: Response) {
  const organization = await OrganizationModel.findOne({ name: req.params.orgName });

  if (!organization) {
    res.status(StatusCodes.NOT_FOUND).send(`Organization ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const project = await ProjectModel.findOne({
    name: req.params.projectName,
    organization: organization._id,
  });

  if (!project) {
    res.status(StatusCodes.NOT_FOUND).send(`Project ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const conditions: MongooseFilterQuery<Pick<ITicketDocument, keyof ITicketDocument>> = {
    title: { $regex: req.pagination.filter, $options: 'i' },
    project: project._id,
    removedAt: { $eq: undefined },
  };

  const [tickets, total] = await Promise.all([
    TicketModel.find(conditions)
      .sort(req.pagination.sort.join(' '))
      .skip(req.pagination.skip)
      .limit(req.pagination.perPage)
      .populate('createdBy', '_id image username email'),
    TicketModel.countDocuments(conditions),
  ]);

  req.total = total;
  res.send(tickets.map(t => t.toObject()));
}
