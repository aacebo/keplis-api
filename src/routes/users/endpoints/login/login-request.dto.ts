import * as joi from 'joi';

export class LoginUserRequest {
  readonly email: string;
}

export const LoginUserRequestSchema = joi.object<LoginUserRequest>({
  email: joi.string().email().required(),
});
