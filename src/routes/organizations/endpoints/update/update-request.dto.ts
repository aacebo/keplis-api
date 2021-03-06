import * as joi from 'joi';

import { NAME_REGEX } from '../../../../core/name';

export class UpdateOrganizationRequest {
  readonly image?: string;
  readonly name?: string;
  readonly displayName?: string;
  readonly description?: string;
  readonly website?: string;
  readonly email?: string;
}

export const UpdateOrganizationRequestSchema = joi.object<UpdateOrganizationRequest>({
  image: joi.string().uri(),
  name: joi.string().regex(NAME_REGEX),
  displayName: joi.string(),
  description: joi.string(),
  website: joi.string().uri(),
  email: joi.string().email(),
});
