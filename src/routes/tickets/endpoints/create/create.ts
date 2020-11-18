import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';
import { OrganizationModel } from '../../../organizations/organization.entity';
import { ProjectModel } from '../../../projects/project.entity';

import { TicketModel } from '../../ticket.entity';
import { TicketStatus } from '../../ticket-status.enum';

import { CreateTicketRequest } from './create-request.dto';

export async function create(req: IAuthRequest<any, any, CreateTicketRequest>, res: Response) {
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

  const ticket = new TicketModel({
    ...req.body,
    project: project._id,
    status: TicketStatus.Open,
    createdBy: req.user.id,
  }).populate('createdBy', '_id image username email');

  await ticket.save();
  const saved = await ticket.execPopulate();

  res.status(StatusCodes.CREATED).send(saved.toObject());
}
