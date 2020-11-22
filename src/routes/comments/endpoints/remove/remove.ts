import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';

import { OrganizationModel } from '../../../organizations/organization.entity';
import { ProjectModel } from '../../../projects/project.entity';
import { TicketModel } from '../../../tickets/ticket.entity';

import { CommentModel } from '../../comment.entity';

export async function remove(req: IAuthRequest, res: Response) {
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

  let comment = await CommentModel.findOne({
    _id: req.params.commentId,
  });

  if (!comment) {
    res.status(StatusCodes.NOT_FOUND).send(`Comment ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  if (comment.createdBy !== req.user.id) {
    res.status(StatusCodes.UNAUTHORIZED).send('Can\'t Remove A Comment You Didn\'t Create');
    return;
  }

  comment.removedAt = new Date();
  const saved = await comment.save();
  const populated = await saved.populate('createdBy', '_id image username email').execPopulate();

  res.send(populated.toObject());
}
