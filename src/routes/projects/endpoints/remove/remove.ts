import { Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';
import { OrganizationModel } from '../../../organizations/organization.entity';

import { ProjectModel } from '../../project.entity';

export async function remove(req: IAuthRequest, res: Response) {
  let project = await ProjectModel.findOne({
    name: req.params.projectName,
  }).populate('createdBy', '_id image username email');

  if (!project) {
    res.status(StatusCodes.NOT_FOUND).send(`Project ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const organization = await OrganizationModel.findById(project.organization);

  if (!organization.owners.includes(req.user.id)) {
    res.status(StatusCodes.UNAUTHORIZED).send('Can\'t Remove A Project That You Don\'t Own');
    return;
  }

  project.removedAt = new Date();
  await project.save();

  res.send(project.toObject());
}
