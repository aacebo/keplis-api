import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { IAuthRequest } from '../../../../../../core/auth';

import { UserModel } from '../../../../../users/user.entity';
import { OrganizationModel } from '../../../../organization.entity';

import { UpdateOrganizationOwnerRequest } from './update-request.dto';

export async function update(req: IAuthRequest<any, any, UpdateOrganizationOwnerRequest>, res: Response) {
  const organization = await OrganizationModel.findOne({ name: req.params.orgName })
                                              .populate('createdBy', '_id image username email');

  if (!organization) {
    res.status(StatusCodes.NOT_FOUND).send(`Organization ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  const user = await UserModel.findOne({ username: req.body.username });

  if (!user) {
    res.status(StatusCodes.NOT_FOUND).send(`User ${ReasonPhrases.NOT_FOUND}`);
    return;
  }

  if (!organization.owners.includes(req.user.id)) {
    res.status(StatusCodes.UNAUTHORIZED).send('Can\'t Update An Organization That You Don\'t Own');
    return;
  }

  const idx = organization.owners.indexOf(user._id);

  if (idx > -1) {
    organization.owners.splice(idx, 1);
  } else {
    organization.owners.push(user._id);
  }

  await organization.save();

  res.send(organization.toObject());
}
