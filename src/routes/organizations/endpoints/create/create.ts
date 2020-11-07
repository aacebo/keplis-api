import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';

import { OrganizationModel } from '../../organization.entity';

import { CreateOrganizationRequest } from './create-request.dto';

export async function create(req: IAuthRequest & Request<any, any, CreateOrganizationRequest>, res: Response) {
  const organization = new OrganizationModel({
    ...req.body,
    owners: [req.user.id],
    createdBy: req.user.id,
  }).populate('createdBy', '_id image username email');

  await organization.save();
  const saved = await organization.execPopulate();

  res.status(StatusCodes.CREATED).send(saved.toObject());
}
