import { MongooseFilterQuery } from 'mongoose';
import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IPaginationRequest } from '../../../../../../core/pagination';

import { TicketModel, ITicketDocument, Ticket } from '../../../../../tickets/ticket.entity';

import { ProjectModel } from '../../../../project.entity';

export async function find(req: IPaginationRequest, res: Response) {
  const project = await ProjectModel.findOne({
    name: req.params.projectName,
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
  res.send(tickets.map(t => t.toObject()).map((t: Ticket) => ({
    ...t,
    comments: t.comments.length,
  })));
}
