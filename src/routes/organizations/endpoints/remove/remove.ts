import { Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { IAuthRequest } from '../../../../core/auth';

import { OrganizationModel } from '../../organization.entity';

export async function remove(req: IAuthRequest, res: Response) {
  let organization = await OrganizationModel.findById(req.params.orgId)
                                            .populate('createdBy', '_id image username email');

  if (!organization) {
    res.status(StatusCodes.NOT_FOUND).send(`Organization ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  if (!organization.owners.includes(req.user.id)) {
    res.status(StatusCodes.UNAUTHORIZED).send('Can\'t Remove An Organization That You Don\'t Own');
    return;
  }

  organization.removedAt = new Date();
  await organization.save();

  res.send(organization.toObject());
}
