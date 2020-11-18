import * as joi from 'joi';

import { NAME_REGEX } from '../../../../core/name';

export class UpdateProjectRequest {
  readonly name?: string;
  readonly displayName?: string;
  readonly description?: string;
}

export const UpdateProjectRequestSchema = joi.object<UpdateProjectRequest>({
  name: joi.string().regex(NAME_REGEX),
  displayName: joi.string(),
  description: joi.string(),
});
