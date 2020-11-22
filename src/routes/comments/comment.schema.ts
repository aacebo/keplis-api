import * as joi from 'joi';

import { Comment } from './comment.entity';

export const CommentSchema = joi.object<Comment>({
  _id: joi.string().uuid({ version: 'uuidv4' }).required(),
  ticket: joi.string().uuid({ version: 'uuidv4' }).required(),
  comments: joi.array().items(joi.string().uuid({ version: 'uuidv4' })).required(),
  title: joi.string().required(),
  body: joi.string().required(),
  createdAt: joi.date().required(),
  createdBy: joi.string().uuid({ version: 'uuidv4' }).required(),
  updatedAt: joi.date(),
  removedAt: joi.date(),
});
