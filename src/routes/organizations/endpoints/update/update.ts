import { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';

import { OrganizationModel } from '../../organization.entity';

import { UpdateOrganizationRequest } from './update-request.dto';

export async function update(req: IAuthRequest & Request<any, any, UpdateOrganizationRequest>, res: Response) {
  let organization = await OrganizationModel.findOne({ name: req.params.name })
                                            .populate('createdBy', '_id image username email');

  if (!organization) {
    res.status(StatusCodes.NOT_FOUND).send(`Organization ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  if (!organization.owners.includes(req.user.id)) {
    res.status(StatusCodes.UNAUTHORIZED).send('Can\'t Update An Organization That You Don\'t Own');
    return;
  }

  organization = Object.assign(organization, req.body);
  await organization.save();

  res.send(organization.toObject());
}
