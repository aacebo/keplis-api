import { UserJoinSchema } from '../../../../../users/user.schema';
import { CommentLikesSchema, CommentSchema } from '../../../../../comments/comment.schema';

export const CreateCommentResponseSchema = CommentSchema.append({
  likes: CommentLikesSchema.required(),
  createdBy: UserJoinSchema.required(),
});
