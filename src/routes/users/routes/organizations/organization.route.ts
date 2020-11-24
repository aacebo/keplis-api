import * as express from 'express';

import { auth } from '../../../../core/auth';
import { validateBody, validateResponse } from '../../../../core/validate';

import * as endpoints from './endpoints';

export const organizationsRoute = express.Router()
.use(auth)
.get(
  '/organizations/:orgName/users',
  validateResponse(endpoints.FindOrganizationOwnersResponseSchema),
  endpoints.find,
)
.put(
  '/organizations/:orgName/users',
  validateBody(endpoints.UpdateOrganizationOwnerRequestSchema),
  validateResponse(endpoints.UpdateOrganizationOwnerResponseSchema),
  endpoints.update,
);
