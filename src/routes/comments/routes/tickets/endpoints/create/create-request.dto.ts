import * as joi from 'joi';

export class CreateCommentRequest {
  readonly body: string;
}

export const CreateCommentRequestSchema = joi.object<CreateCommentRequest>({
  body: joi.string().required(),
});
