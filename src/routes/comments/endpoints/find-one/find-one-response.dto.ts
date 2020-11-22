import { UserJoinSchema } from '../../../users';

import { CommentSchema } from '../../comment.schema';

export const FindOneCommentResponseSchema = CommentSchema.append({
  createdBy: UserJoinSchema.required(),
});
