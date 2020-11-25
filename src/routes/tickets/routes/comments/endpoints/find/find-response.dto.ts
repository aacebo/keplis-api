import * as joi from 'joi';

import { UserJoinSchema } from '../../../../../users/user.schema';
import { CommentLikesSchema, CommentSchema } from '../../../../../comments/comment.schema';

export const FindCommentResponseSchema = joi.array().items(CommentSchema.append({
  comments: joi.number().min(0).required(),
  likes: CommentLikesSchema.required(),
  createdBy: UserJoinSchema.required(),
}));
