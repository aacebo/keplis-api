import * as joi from 'joi';

import { NAME_REGEX } from '../../../../../../core/name';

export class UpdateOrganizationOwnerRequest {
  readonly username: string;
}

export const UpdateOrganizationOwnerRequestSchema = joi.object<UpdateOrganizationOwnerRequest>({
  username: joi.string().regex(NAME_REGEX).required(),
});
