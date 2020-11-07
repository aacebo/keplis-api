import * as joi from 'joi';

export class CreateOrganizationRequest {
  readonly image?: string;
  readonly private: boolean;
  readonly name: string;
  readonly displayName: string;
  readonly description?: string;
  readonly website?: string;
  readonly email?: string;
}

export const CreateOrganizationRequestSchema = joi.object<CreateOrganizationRequest>({
  image: joi.string().uri(),
  private: joi.boolean().required(),
  name: joi.string().regex(/^[a-z0-9-]+$/).required(),
  displayName: joi.string().required(),
  description: joi.string(),
  website: joi.string().uri(),
  email: joi.string().email(),
});
