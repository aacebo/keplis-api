import * as express from 'express';

import { auth } from '../../../../core/auth';
import { validateBody, validateResponse } from '../../../../core/validate';

import * as endpoints from './endpoints';

export const organizationOwnersRoute = express.Router()
.use(auth)
.get(
  '/organizations/:orgName/owners',
  validateResponse(endpoints.FindOrganizationOwnersResponseSchema),
  endpoints.find,
)
.put(
  '/organizations/:orgName/owners',
  validateBody(endpoints.UpdateOrganizationOwnerRequestSchema),
  validateResponse(endpoints.UpdateOrganizationOwnerResponseSchema),
  endpoints.update,
);
