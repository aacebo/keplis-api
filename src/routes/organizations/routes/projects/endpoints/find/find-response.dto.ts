import * as joi from 'joi';

import { UserJoinSchema } from '../../../../../users/user.schema';

import { ProjectSchema } from '../../project.schema';

export const FindProjectResponseSchema = joi.array().items(ProjectSchema.append({
  createdBy: UserJoinSchema.required(),
}));
