import { MongooseFilterQuery } from 'mongoose';
import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IPaginationRequest } from '../../../../core/pagination';
import { OrganizationModel } from '../../../organizations/organization.entity';
import { ProjectModel } from '../../../projects/project.entity';
import { TicketModel } from '../../../tickets/ticket.entity';

import { CommentModel, Comment, ICommentDocument } from '../../comment.entity';

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

  const ticket = await TicketModel.findOne({
    number: +req.params.ticketNumber,
    project: project._id,
  });

  if (!ticket) {
    res.status(StatusCodes.NOT_FOUND).send(`Ticket ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const conditions: MongooseFilterQuery<Pick<ICommentDocument, keyof ICommentDocument>> = {
    body: { $regex: req.pagination.filter, $options: 'i' },
    ticket: ticket._id,
    removedAt: { $eq: undefined },
  };

  const [comments, total] = await Promise.all([
    CommentModel.find(conditions)
      .sort(req.pagination.sort.join(' '))
      .skip(req.pagination.skip)
      .limit(req.pagination.perPage)
      .populate('createdBy', '_id image username email'),
    CommentModel.countDocuments(conditions),
  ]);

  req.total = total;
  res.send(comments.map(c => c.toObject()).map((c: Comment) => ({
    ...c,
    comments: c.comments.length,
  })));
}
