import * as joi from 'joi';

import { NAME_REGEX } from '../../../../core/name';

export class UpdateUserRequest {
  readonly image?: string;
  readonly username?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly dob?: Date;
  readonly email?: string;
}

export const UpdateUserRequestSchema = joi.object<UpdateUserRequest>({
  image: joi.string().uri(),
  username: joi.string().regex(NAME_REGEX),
  firstName: joi.string(),
  lastName: joi.string(),
  dob: joi.date(),
  email: joi.string().email(),
});
