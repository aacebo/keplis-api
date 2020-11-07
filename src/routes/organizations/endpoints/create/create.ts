import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';

import { OrganizationModel } from '../../organization.entity';

import { CreateOrganizationRequest } from './create-request.dto';

export async function create(req: IAuthRequest & Request<any, any, CreateOrganizationRequest>, res: Response) {
  const organization = new OrganizationModel({
    ...req.body,
    createdBy: req.user.id,
  });

  await organization.save();
  res.status(StatusCodes.CREATED).send(organization.toObject());
}
