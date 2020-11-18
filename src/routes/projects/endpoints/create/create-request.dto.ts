import * as joi from 'joi';

import { NAME_REGEX } from '../../../../core/name';

export class CreateProjectRequest {
  readonly name: string;
  readonly displayName: string;
  readonly description?: string;
}

export const CreateProjectRequestSchema = joi.object<CreateProjectRequest>({
  name: joi.string().regex(NAME_REGEX).required(),
  displayName: joi.string().required(),
  description: joi.string(),
});
