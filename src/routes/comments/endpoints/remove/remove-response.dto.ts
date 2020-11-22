import { UserJoinSchema } from '../../../users';

import { CommentSchema } from '../../comment.schema';

export const RemoveCommentResponseSchema = CommentSchema.append({
  createdBy: UserJoinSchema.required(),
});
