import { Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';
import { OrganizationModel } from '../../../organizations/organization.entity';

import { ProjectModel } from '../../project.entity';

import { UpdateProjectRequest } from './update-request.dto';

export async function update(req: IAuthRequest<any, any, UpdateProjectRequest>, res: Response) {
  const organization = await OrganizationModel.findOne({ name: req.params.orgName });

  if (!organization) {
    res.status(StatusCodes.NOT_FOUND).send(`Organization ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  if (!organization.owners.includes(req.user.id)) {
    res.status(StatusCodes.UNAUTHORIZED).send('Can\'t Update A Project That You Don\'t Own');
    return;
  }

  let project = await ProjectModel.findOne({
    name: req.params.projectName,
    organization: organization._id,
  }).populate('createdBy', '_id image username email');

  if (!project) {
    res.status(StatusCodes.NOT_FOUND).send(`Project ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  project = Object.assign(project, req.body);
  await project.save();

  res.send(project.toObject());
}
