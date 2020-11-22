import * as joi from 'joi';

import { UserJoinSchema } from '../../../users/user.schema';

import { CommentSchema } from '../../comment.schema';

export const FindCommentResponseSchema = joi.array().items(CommentSchema.append({
  comments: joi.number().min(0).required(),
  createdBy: UserJoinSchema.required(),
}));
