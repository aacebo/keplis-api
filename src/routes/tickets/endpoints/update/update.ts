import { Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';
import { OrganizationModel } from '../../../organizations/organization.entity';

import { ProjectModel } from '../../../projects/project.entity';
import { TicketModel } from '../../ticket.entity';

import { UpdateTicketRequest } from './update-request.dto';

export async function update(req: IAuthRequest<any, any, UpdateTicketRequest>, res: Response) {
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

  let ticket = await TicketModel.findOne({
    number: +req.params.ticketNumber,
    project: project._id,
  }).populate('createdBy', '_id image username email');

  if (!ticket) {
    res.status(StatusCodes.NOT_FOUND).send(`Ticket ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  ticket = Object.assign(ticket, req.body);
  await ticket.save();

  res.send(ticket.toObject());
}
