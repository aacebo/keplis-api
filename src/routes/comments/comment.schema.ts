import * as joi from 'joi';

import { NAME_REGEX } from '../../core/name';

import { User } from '../users/user.entity';

import { Comment } from './comment.entity';

export const CommentSchema = joi.object<Comment>({
  _id: joi.string().uuid({ version: 'uuidv4' }).required(),
  ticket: joi.string().uuid({ version: 'uuidv4' }),
  comments: joi.array().items(joi.string().uuid({ version: 'uuidv4' })).required(),
  likes: joi.array().items(joi.string().uuid({ version: 'uuidv4' })).required(),
  body: joi.string().required(),
  createdAt: joi.date().required(),
  createdBy: joi.string().uuid({ version: 'uuidv4' }).required(),
  updatedAt: joi.date(),
  removedAt: joi.date(),
});

export const CommentLikesSchema = joi.array().items(joi.object<User>({
  _id: joi.string().uuid({ version: 'uuidv4' }).required(),
  username: joi.string().regex(NAME_REGEX).required(),
}));
