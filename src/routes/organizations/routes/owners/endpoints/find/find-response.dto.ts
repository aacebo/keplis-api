import * as joi from 'joi';

import { UserJoinSchema } from '../../../../../users/user.schema';

export const FindOrganizationOwnersResponseSchema = joi.array().items(UserJoinSchema);
