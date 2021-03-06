import * as joi from 'joi';

import { NAME_REGEX } from '../../core/name';

import { User } from './user.entity';

export const UserSchema = joi.object<User>({
  _id: joi.string().uuid({ version: 'uuidv4' }).required(),
  origin: joi.string().valid('google'),
  image: joi.string().uri(),
  username: joi.string().regex(NAME_REGEX).required(),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  dob: joi.date().required(),
  email: joi.string().email().required(),
  createdAt: joi.date().required(),
  updatedAt: joi.date(),
  removedAt: joi.date(),
});

export const UserJoinSchema = joi.object<User>({
  _id: joi.string().uuid({ version: 'uuidv4' }).required(),
  image: joi.string().uri(),
  username: joi.string().regex(NAME_REGEX).required(),
  email: joi.string().email().required(),
});
