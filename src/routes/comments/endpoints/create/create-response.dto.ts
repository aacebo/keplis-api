import { UserJoinSchema } from '../../../users';

import { CommentSchema } from '../../comment.schema';

export const CreateCommentResponseSchema = CommentSchema.append({
  createdBy: UserJoinSchema.required(),
});
