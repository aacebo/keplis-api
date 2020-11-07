import { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { OrganizationModel } from '../../organization.entity';

export async function findOne(req: Request, res: Response) {
  const organization = await OrganizationModel.findById(req.params.orgId)
                                              .populate('createdBy', '_id image username email');

  if (!organization) {
    res.status(StatusCodes.NOT_FOUND).send(`Organization ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  res.send(organization.toObject());
}
