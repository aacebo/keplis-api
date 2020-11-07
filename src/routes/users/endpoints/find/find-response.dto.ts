import * as joi from 'joi';

import { UserSchema } from '../../user.schema';

export const FindUserResponseSchema = joi.array().items(UserSchema);
