import { UserJoinSchema } from '../../../users';

import { CommentSchema } from '../../comment.schema';

export const UpdateCommentResponseSchema = CommentSchema.append({
  createdBy: UserJoinSchema.required(),
});
