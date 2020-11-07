import * as joi from 'joi';

import { User } from '../../user.entity';
import { UserSchema } from '../../user.schema';

export class LoginUserResponse {
  readonly token: string;
  readonly user: User
}

export const LoginUserResponseSchema = joi.object<LoginUserResponse>({
  token: joi.string().required(),
  user: UserSchema.required(),
});
