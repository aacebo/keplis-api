import * as joi from 'joi';

import { Organization } from './organization.entity';

export const OrganizationSchema = joi.object<Organization>({
  _id: joi.string().uuid({ version: 'uuidv4' }).required(),
  image: joi.string().uri(),
  private: joi.boolean().required(),
  name: joi.string().regex(/^[a-z0-9-]+$/).required(),
  displayName: joi.string().required(),
  description: joi.string(),
  website: joi.string().uri(),
  email: joi.string().email(),
  owners: joi.array().items(joi.string().uuid({ version: 'uuidv4' })).required(),
  viewers: joi.array().items(joi.string().uuid({ version: 'uuidv4' })).required(),
  createdAt: joi.date().required(),
  createdBy: joi.string().uuid({ version: 'uuidv4' }).required(),
  updatedAt: joi.date(),
  removedAt: joi.date(),
});
