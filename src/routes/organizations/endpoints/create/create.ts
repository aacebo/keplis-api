import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';

import { OrganizationModel } from '../../organization.entity';

import { CreateOrganizationRequest } from './create-request.dto';

export async function create(req: IAuthRequest<any, any, CreateOrganizationRequest>, res: Response) {
  const existing = await OrganizationModel.findOne({ name: req.body.name });

  if (existing) {
    res.status(StatusCodes.CONFLICT).send('Organization Name Already Exists');
    return;
  }

  const organization = new OrganizationModel({
    ...req.body,
    owners: [req.user.id],
    createdBy: req.user.id,
  }).populate('createdBy', '_id image username email');

  await organization.save();
  const saved = await organization.execPopulate();

  res.status(StatusCodes.CREATED).send(saved.toObject());
}
