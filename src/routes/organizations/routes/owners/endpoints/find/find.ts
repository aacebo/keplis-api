import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../../../core/auth';
import { OrganizationModel } from '../../../../organization.entity';

export async function find(req: IAuthRequest, res: Response) {
  const organization = await OrganizationModel.findOne({ name: req.params.orgName })
                                              .populate('owners', '_id image username email');

  if (!organization) {
    res.status(StatusCodes.NOT_FOUND).send(`Organization ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  res.send(organization.toObject().owners);
}
