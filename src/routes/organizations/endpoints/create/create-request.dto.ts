import * as joi from 'joi';

import { NAME_REGEX } from '../../../../core/name';

export class CreateOrganizationRequest {
  readonly image?: string;
  readonly name: string;
  readonly displayName: string;
  readonly description?: string;
  readonly website?: string;
  readonly email?: string;
}

export const CreateOrganizationRequestSchema = joi.object<CreateOrganizationRequest>({
  image: joi.string().uri(),
  name: joi.string().regex(NAME_REGEX).required(),
  displayName: joi.string().required(),
  description: joi.string(),
  website: joi.string().uri(),
  email: joi.string().email(),
});
