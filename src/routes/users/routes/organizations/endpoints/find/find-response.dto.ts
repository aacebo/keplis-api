import * as joi from 'joi';

import { UserJoinSchema } from '../../../../user.schema';

export const FindOrganizationOwnersResponseSchema = joi.array().items(UserJoinSchema);
