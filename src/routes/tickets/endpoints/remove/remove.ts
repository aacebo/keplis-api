import { Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';
import { OrganizationModel } from '../../../organizations/organization.entity';

import { ProjectModel } from '../../../projects/project.entity';
import { TicketModel } from '../../ticket.entity';

export async function remove(req: IAuthRequest, res: Response) {
  const organization = await OrganizationModel.findOne({ name: req.params.orgName });

  if (!organization) {
    res.status(StatusCodes.NOT_FOUND).send(`Organization ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const project = await ProjectModel.findOne({ name: req.params.projectName });

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

  if (ticket.createdBy !== req.user.id) {
    res.status(StatusCodes.UNAUTHORIZED).send('Can\'t Remove A Ticket You Didn\'t Create');
    return;
  }

  ticket.removedAt = new Date();
  const saved = await ticket.save();
  const populated = await saved.populate('createdBy', '_id image username email').execPopulate();

  res.send(populated.toObject());
}
