import { UserJoinSchema } from '../../../users';

import { CommentLikesSchema, CommentSchema } from '../../comment.schema';

export const RemoveCommentResponseSchema = CommentSchema.append({
  likes: CommentLikesSchema.required(),
  createdBy: UserJoinSchema.required(),
});
