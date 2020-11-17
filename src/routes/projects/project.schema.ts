import * as joi from 'joi';

import { NAME_REGEX } from '../../core/name';

import { Project } from './project.entity';

export const ProjectSchema = joi.object<Project>({
  _id: joi.string().uuid({ version: 'uuidv4' }).required(),
  name: joi.string().regex(NAME_REGEX).required(),
  displayName: joi.string().required(),
  description: joi.string(),
  createdAt: joi.date().required(),
  createdBy: joi.string().uuid({ version: 'uuidv4' }).required(),
  updatedAt: joi.date(),
  removedAt: joi.date(),
});
