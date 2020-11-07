import * as joi from 'joi';

import { UserJoinSchema } from '../../../users';

import { OrganizationSchema } from '../../organization.schema';

export const FindOrganizationResponseSchema = joi.array().items(OrganizationSchema.append({
  owners: joi.number().min(0).required(),
  viewers: joi.number().min(0).required(),
  createdBy: UserJoinSchema.required(),
}));
