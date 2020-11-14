import * as joi from 'joi';

import { NAME_REGEX } from '../../core/name';

import { Organization } from './organization.entity';

export const OrganizationSchema = joi.object<Organization>({
  _id: joi.string().uuid({ version: 'uuidv4' }).required(),
  image: joi.string().uri(),
  name: joi.string().regex(NAME_REGEX).required(),
  displayName: joi.string().required(),
  description: joi.string(),
  website: joi.string().uri(),
  email: joi.string().email(),
  owners: joi.array().items(joi.string().uuid({ version: 'uuidv4' })).required(),
  createdAt: joi.date().required(),
  createdBy: joi.string().uuid({ version: 'uuidv4' }).required(),
  updatedAt: joi.date(),
  removedAt: joi.date(),
});
