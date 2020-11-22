import * as joi from 'joi';

export class UpdateCommentRequest {
  readonly body?: string;
}

export const UpdateCommentRequestSchema = joi.object<UpdateCommentRequest>({
  body: joi.string(),
});
