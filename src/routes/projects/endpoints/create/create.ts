import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';

import { ProjectModel } from '../../project.entity';

import { CreateProjectRequest } from './create-request.dto';

export async function create(req: IAuthRequest<any, any, CreateProjectRequest>, res: Response) {
  const project = new ProjectModel({
    ...req.body,
    createdBy: req.user.id,
  }).populate('createdBy', '_id image username email');

  await project.save();
  const saved = await project.execPopulate();

  res.status(StatusCodes.CREATED).send(saved.toObject());
}
