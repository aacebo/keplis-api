import { UserJoinSchema } from '../../../users';

import { CommentLikesSchema, CommentSchema } from '../../comment.schema';

export const CreateCommentResponseSchema = CommentSchema.append({
  likes: CommentLikesSchema.required(),
  createdBy: UserJoinSchema.required(),
});
