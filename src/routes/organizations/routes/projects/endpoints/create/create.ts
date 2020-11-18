import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../../../core/auth';
import { OrganizationModel } from '../../../../organization.entity';

import { ProjectModel } from '../../project.entity';

import { CreateProjectRequest } from './create-request.dto';

export async function create(req: IAuthRequest<any, any, CreateProjectRequest>, res: Response) {
  const organization = await OrganizationModel.findOne({ name: req.params.orgName });

  if (!organization) {
    res.status(StatusCodes.NOT_FOUND).send(`Organization ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const project = new ProjectModel({
    ...req.body,
    organization: organization._id,
    createdBy: req.user.id,
  }).populate('createdBy', '_id image username email');

  await project.save();
  const saved = await project.execPopulate();

  res.status(StatusCodes.CREATED).send(saved.toObject());
}
