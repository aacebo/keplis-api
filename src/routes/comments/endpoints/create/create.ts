import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';

import { OrganizationModel } from '../../../organizations/organization.entity';
import { ProjectModel } from '../../../projects/project.entity';
import { TicketModel } from '../../../tickets/ticket.entity';

import { CommentModel } from '../../comment.entity';

import { CreateCommentRequest } from './create-request.dto';

export async function create(req: IAuthRequest<any, any, CreateCommentRequest>, res: Response) {
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

  const comment = new CommentModel({
    ...req.body,
    ticket: ticket._id,
    createdBy: req.user.id,
  }).populate('createdBy', '_id image username email');

  await comment.save();
  const saved = await comment.execPopulate();

  ticket.comments.push(saved._id);
  await ticket.save();

  res.status(StatusCodes.CREATED).send(saved.toObject());
}
